import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocalities } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Locality } from '@doorspeaks/shared';

function LocalityCard({ locality }: { locality: Locality }) {
  const rentRange = locality.rentRanges.find((r) => r.bhk === 2);
  return (
    <Link
      to={`/localities/${locality.slug}`}
      className="card p-5 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            {locality.name}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{locality.zone} Bangalore</span>
        </div>
        {locality.metroLine && (
          <span className="badge bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs">
            🚇 Metro
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{locality.description}</p>
      {rentRange && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">2 BHK rent</span>
          <span className="font-semibold text-teal-700 dark:text-teal-400">
            ₹{(rentRange.min / 1000).toFixed(0)}k–₹{(rentRange.max / 1000).toFixed(0)}k/mo
          </span>
        </div>
      )}
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Deposit: {locality.typicalDepositMonths.min}–{locality.typicalDepositMonths.max} months
      </div>
    </Link>
  );
}

export default function LocalitiesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['localities'],
    queryFn: getLocalities,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bangalore Locality Intelligence</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Typical rent ranges, deposit norms, metro access, and insights for 15+ localities.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-500 dark:text-red-400">
          Failed to load localities. Is the API running?
        </div>
      )}

      {data && (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Link to="/compare" className="btn-secondary text-sm py-2">Compare Localities →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.data.map((locality) => (
              <LocalityCard key={locality.id} locality={locality} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
