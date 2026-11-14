import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getLocality, checkRentFairness } from '../api';
import type { RentFairnessResult } from '@doorspeaks/shared';
import LoadingSpinner from '../components/LoadingSpinner';

function SparkLine({ trend }: { trend: { month: string; avgRent: number }[] }) {
  if (trend.length < 2) return null;
  const min = Math.min(...trend.map((t) => t.avgRent));
  const max = Math.max(...trend.map((t) => t.avgRent));
  const range = max - min || 1;
  const W = 180;
  const H = 50;
  const pts = trend.map((t, i) => {
    const x = (i / (trend.length - 1)) * W;
    const y = H - ((t.avgRent - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="text-teal-500">
      <polyline points={pts.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LocalityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [fairnessForm, setFairnessForm] = useState({
    bhk: 2,
    furnishing: 'semi-furnished' as 'unfurnished' | 'semi-furnished' | 'fully-furnished',
    quotedRent: '',
  });
  const [fairnessResult, setFairnessResult] = useState<RentFairnessResult | null>(null);

  const { data: locality, isLoading, isError } = useQuery({
    queryKey: ['locality', slug],
    queryFn: () => getLocality(slug!),
    enabled: !!slug,
  });

  const fairnessMutation = useMutation({
    mutationFn: checkRentFairness,
    onSuccess: (data) => setFairnessResult(data),
  });

  if (isLoading) {
    return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  }

  if (isError || !locality) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Locality not found</h2>
        <Link to="/localities" className="btn-primary mt-4 inline-block">Back to Localities</Link>
      </div>
    );
  }

  const handleFairness = (e: React.FormEvent) => {
    e.preventDefault();
    fairnessMutation.mutate({
      locality: locality.slug,
      bhk: fairnessForm.bhk,
      furnishing: fairnessForm.furnishing,
      quotedRent: parseInt(fairnessForm.quotedRent, 10),
    });
  };

  const verdictColor = {
    'Below market': 'text-green-600 dark:text-green-400',
    'Within market': 'text-teal-600 dark:text-teal-400',
    'Above market': 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/localities" className="hover:text-teal-600 dark:hover:text-teal-400">Localities</Link>
        {' › '}
        <span>{locality.name}</span>
      </nav>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{locality.name}</h1>
              {locality.metroLine && (
                <span className="badge bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  🚇 {locality.metroLine}
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{locality.zone} Bangalore</p>
            {locality.metroStation && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nearest station: {locality.metroStation}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-slate-600 dark:text-slate-400">
            <div className="font-semibold">Typical deposit:</div>
            <div className="text-teal-700 dark:text-teal-400 font-bold">
              {locality.typicalDepositMonths.min}–{locality.typicalDepositMonths.max} months
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-4">{locality.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent ranges */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Rent Ranges</h2>
          <div className="space-y-3">
            {locality.rentRanges.map((r) => (
              <div key={r.bhk} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="font-medium text-slate-800 dark:text-slate-200">{r.bhk} BHK</span>
                <span className="text-teal-700 dark:text-teal-400 font-semibold">
                  ₹{r.min.toLocaleString('en-IN')} – ₹{r.max.toLocaleString('en-IN')}/mo
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Semi-furnished typical. Fully furnished adds ~20–25%.</p>
        </div>

        {/* Rent trend sparkline */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Rent Trend (12 months)</h2>
          <div className="mb-2">
            <SparkLine trend={locality.rentTrend} />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{locality.rentTrend[0]?.month}</span>
            <span>₹{locality.rentTrend[locality.rentTrend.length - 1]?.avgRent?.toLocaleString('en-IN')}/mo avg</span>
            <span>{locality.rentTrend[locality.rentTrend.length - 1]?.month}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on seeded demo data for illustration purposes only.</p>
        </div>
      </div>

      {/* Rent fairness estimator */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">🧮 Rent Fairness Estimator</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Is the rent you're being quoted fair for {locality.name}?
        </p>
        <form onSubmit={handleFairness} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="label" htmlFor="f-bhk">BHK</label>
            <select
              id="f-bhk"
              value={fairnessForm.bhk}
              onChange={(e) => setFairnessForm((f) => ({ ...f, bhk: parseInt(e.target.value) }))}
              className="input"
            >
              {locality.rentRanges.map((r) => (
                <option key={r.bhk} value={r.bhk}>{r.bhk} BHK</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-furnishing">Furnishing</label>
            <select
              id="f-furnishing"
              value={fairnessForm.furnishing}
              onChange={(e) => setFairnessForm((f) => ({ ...f, furnishing: e.target.value as 'unfurnished' | 'semi-furnished' | 'fully-furnished' }))}
              className="input"
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="fully-furnished">Fully furnished</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-rent">Quoted Rent (₹)</label>
            <input
              id="f-rent"
              type="number"
              required
              min={1000}
              value={fairnessForm.quotedRent}
              onChange={(e) => setFairnessForm((f) => ({ ...f, quotedRent: e.target.value }))}
              className="input"
              placeholder="30000"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={fairnessMutation.isPending} className="btn-primary w-full">
              {fairnessMutation.isPending ? <LoadingSpinner size="sm" /> : 'Check'}
            </button>
          </div>
        </form>

        {fairnessResult && (
          <div className={`mt-5 p-4 rounded-xl border ${
            fairnessResult.verdict === 'Below market' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
            fairnessResult.verdict === 'Within market' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800' :
            'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          }`}>
            <div className={`text-lg font-bold mb-1 ${verdictColor[fairnessResult.verdict]}`}>
              {fairnessResult.verdict === 'Below market' ? '✅' : fairnessResult.verdict === 'Within market' ? '✓' : '⚠️'}
              {' '}{fairnessResult.verdict}
              {fairnessResult.percentDiff !== 0 && (
                <span className="text-sm font-normal ml-2">
                  ({fairnessResult.percentDiff > 0 ? '+' : ''}{fairnessResult.percentDiff}% vs market midpoint)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{fairnessResult.advice}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-6">
        <Link to="/localities" className="btn-secondary text-sm">← All Localities</Link>
        <Link to={`/landlords?locality=${encodeURIComponent(locality.name)}`} className="btn-primary text-sm">
          Search Landlords in {locality.name} →
        </Link>
      </div>
    </div>
  );
}
