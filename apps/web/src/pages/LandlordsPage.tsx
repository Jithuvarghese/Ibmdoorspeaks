import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchLandlords } from '../api';
import LandlordCard from '../components/LandlordCard';
import LoadingSpinner from '../components/LoadingSpinner';

const LOCALITIES = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Marathahalli',
  'Bellandur', 'Electronic City', 'JP Nagar', 'Jayanagar', 'BTM Layout',
  'Hebbal', 'Yelahanka', 'Banashankari', 'Malleshwaram', 'Sarjapur Road',
];

export default function LandlordsPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [locality, setLocality] = useState(params.get('locality') ?? '');
  const [minRating, setMinRating] = useState(params.get('minRating') ?? '');
  const [sort, setSort] = useState(params.get('sort') ?? 'rating');
  const [page, setPage] = useState(parseInt(params.get('page') ?? '1', 10));

  // Sync to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (locality) sp.set('locality', locality);
    if (minRating) sp.set('minRating', minRating);
    if (sort !== 'rating') sp.set('sort', sort);
    if (page !== 1) sp.set('page', String(page));
    setParams(sp, { replace: true });
  }, [q, locality, minRating, sort, page, setParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['landlords', q, locality, minRating, sort, page],
    queryFn: () => searchLandlords({ q, locality, minRating: minRating ? parseFloat(minRating) : undefined, sort, page }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Search Landlords</h1>
        <p className="text-slate-600 dark:text-slate-400">Read honest reviews from previous tenants in Bangalore</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="card p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="label" htmlFor="search-q">Landlord name or locality</label>
            <input
              id="search-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Sharma, Koramangala..."
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="locality">Locality</label>
            <select
              id="locality"
              value={locality}
              onChange={(e) => { setLocality(e.target.value); setPage(1); }}
              className="input"
            >
              <option value="">All localities</option>
              {LOCALITIES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="minRating">Min rating</label>
            <select
              id="minRating"
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
              className="input"
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input"
            >
              <option value="rating">Highest rating</option>
              <option value="reviews">Most reviews</option>
              <option value="recent">Most recent</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn-primary">Search</button>
        </div>
      </form>

      {/* Results */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-600 dark:text-red-400">
          <p>Failed to load landlords. Is the API running?</p>
          <p className="text-sm mt-2 text-slate-500">Make sure the API server is running at http://localhost:4000</p>
        </div>
      )}

      {data && !isLoading && (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {data.pagination.total} landlord{data.pagination.total !== 1 ? 's' : ''} found
            </p>
            <Link to="/write-review" className="btn-secondary text-sm py-2">
              + Add a landlord / review
            </Link>
          </div>

          {data.data.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No landlords found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {q || locality ? 'Try adjusting your search filters.' : 'Be the first to add a landlord review!'}
              </p>
              <Link to="/write-review" className="btn-primary">Write a Review</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {data.data.map((landlord) => (
                <LandlordCard key={landlord.id} landlord={landlord} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
