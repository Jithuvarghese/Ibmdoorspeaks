import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLandlord, submitReport } from '../api';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';

const RATING_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  depositReturn: 'Deposit Return',
  privacyRespect: 'Privacy',
  rentIncreaseFairness: 'Rent Fairness',
  communication: 'Communication',
};

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  const color = value >= 4 ? 'bg-green-500' : value >= 3 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 dark:text-slate-400 w-32 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function LandlordDetail() {
  const { id } = useParams<{ id: string }>();
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('defamation');
  const [reportSent, setReportSent] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['landlord', id],
    queryFn: () => getLandlord(id!),
    enabled: !!id,
  });

  const handleReport = async () => {
    if (!id) return;
    await submitReport({ targetType: 'landlord', targetId: id, reason: reportReason as 'defamation' | 'fake' | 'pii' | 'harassment' | 'other' });
    setReportSent(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Landlord not found</h2>
        <Link to="/landlords" className="btn-primary mt-4 inline-block">Back to search</Link>
      </div>
    );
  }

  const { landlord, properties, reviews, ratingBreakdown } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/landlords" className="hover:text-teal-600 dark:hover:text-teal-400">Landlords</Link>
        {' › '}
        <span>{landlord.name}</span>
      </nav>

      {/* Header card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{landlord.name}</h1>
              {landlord.isDemo && <span className="demo-banner">DEMO DATA</span>}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {landlord.localities.join(' · ')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-700 dark:text-teal-400">
              {landlord.avgRating.toFixed(1)}
            </div>
            <StarRating value={landlord.avgRating} showText={false} />
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {landlord.reviewCount} review{landlord.reviewCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Badges */}
        {landlord.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {landlord.badges.map((b) => (
              <span key={b} className="badge bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                ✓ {b}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Link
            to={`/write-review?landlordId=${landlord.id}&landlordName=${encodeURIComponent(landlord.name)}`}
            className="btn-primary text-sm py-2"
          >
            Write a Review
          </Link>
          <button
            onClick={() => setShowReport(true)}
            className="btn-secondary text-sm py-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating breakdown */}
        <div className="lg:col-span-1">
          <div className="card p-5 mb-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Rating Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(ratingBreakdown).map(([key, val]) => (
                <RatingBar key={key} label={RATING_LABELS[key] ?? key} value={val} />
              ))}
            </div>
          </div>

          {/* Properties */}
          {properties.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Properties</h2>
              <div className="space-y-2">
                {properties.map((p) => (
                  <div key={p.id} className="text-sm text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{p.bhk} BHK</span> in {p.locality}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
              {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
            </h2>
          </div>
          {reviews.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">No reviews yet. Be the first!</p>
              <Link
                to={`/write-review?landlordId=${landlord.id}&landlordName=${encodeURIComponent(landlord.name)}`}
                className="btn-primary text-sm"
              >
                Write a Review
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report modal */}
      {showReport && !reportSent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Report this landlord</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              If you believe this listing contains false information or violates our policies, please let us know.
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input mb-4"
            >
              <option value="defamation">False or defamatory information</option>
              <option value="fake">Fake landlord listing</option>
              <option value="pii">Contains personal information</option>
              <option value="harassment">Harassment or abuse</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button onClick={handleReport} className="btn-primary flex-1">Submit Report</button>
              <button onClick={() => setShowReport(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {reportSent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Report submitted</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Our moderation team will review this within 48 hours.</p>
            <button onClick={() => { setShowReport(false); setReportSent(false); }} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
