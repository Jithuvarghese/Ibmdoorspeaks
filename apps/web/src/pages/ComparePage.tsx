import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocalities } from '../api';
import type { Locality } from '@doorspeaks/shared';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

type Slot = Locality | null;

export default function ComparePage() {
  const [selected, setSelected] = useState<[Slot, Slot, Slot]>([null, null, null]);
  const { data, isLoading } = useQuery({ queryKey: ['localities'], queryFn: getLocalities });

  const pickLocality = (idx: 0 | 1 | 2, slug: string) => {
    const loc = data?.data.find((l) => l.slug === slug) ?? null;
    setSelected((prev) => {
      const next = [...prev] as [Slot, Slot, Slot];
      next[idx] = loc;
      return next;
    });
  };

  const BHKs = [1, 2, 3];

  if (isLoading) {
    return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Compare Localities</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Select up to 3 localities to compare side by side</p>

      {/* Selectors */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {([0, 1, 2] as (0 | 1 | 2)[]).map((idx) => (
          <div key={idx}>
            <label className="label">Locality {idx + 1}</label>
            <select
              value={selected[idx]?.slug ?? ''}
              onChange={(e) => pickLocality(idx, e.target.value)}
              className="input"
            >
              <option value="">Select...</option>
              {data?.data.map((l) => (
                <option key={l.slug} value={l.slug}>{l.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {selected.some(Boolean) && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-slate-100 dark:bg-slate-700 rounded-tl-lg font-semibold text-slate-600 dark:text-slate-300 w-32">Feature</th>
                {selected.map((loc, i) => (
                  <th key={i} className="p-3 bg-slate-100 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white text-center last:rounded-tr-lg">
                    {loc ? (
                      <Link to={`/localities/${loc.slug}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                        {loc.name}
                      </Link>
                    ) : '—'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">Zone</td>
                {selected.map((loc, i) => (
                  <td key={i} className="p-3 text-center text-slate-600 dark:text-slate-400">{loc?.zone ?? '—'}</td>
                ))}
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">Metro</td>
                {selected.map((loc, i) => (
                  <td key={i} className="p-3 text-center">
                    {loc ? (loc.metroLine ? <span className="text-blue-600 dark:text-blue-400">✓ {loc.metroStation}</span> : <span className="text-slate-400">None</span>) : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">Deposit norm</td>
                {selected.map((loc, i) => (
                  <td key={i} className="p-3 text-center text-slate-700 dark:text-slate-300">
                    {loc ? `${loc.typicalDepositMonths.min}–${loc.typicalDepositMonths.max} months` : '—'}
                  </td>
                ))}
              </tr>
              {BHKs.map((bhk) => (
                <tr key={bhk} className="border-t border-slate-200 dark:border-slate-700 odd:bg-slate-50 dark:odd:bg-slate-800/20">
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{bhk} BHK rent</td>
                  {selected.map((loc, i) => {
                    const range = loc?.rentRanges.find((r) => r.bhk === bhk);
                    return (
                      <td key={i} className="p-3 text-center font-medium text-teal-700 dark:text-teal-400">
                        {range ? `₹${(range.min / 1000).toFixed(0)}k–₹${(range.max / 1000).toFixed(0)}k` : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selected.some(Boolean) && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <div className="text-4xl mb-3">📊</div>
          <p>Select localities above to compare</p>
        </div>
      )}
    </div>
  );
}
