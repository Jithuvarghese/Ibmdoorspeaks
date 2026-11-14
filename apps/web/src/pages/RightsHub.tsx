import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRights } from '../api';
import type { RightsListItem } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  'All', 'Deposits', 'Rent', 'Eviction', 'Privacy', 'Agreements',
  'Documentation', 'Utilities', 'Maintenance', 'Legal Process',
];

function ArticleCard({ article }: { article: RightsListItem }) {
  return (
    <Link
      to={`/rights/${article.slug}`}
      className="card p-5 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="badge bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
          {article.category}
        </span>
        {article.needsLawyerVerification && (
          <span className="badge bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            🔖 Verify with lawyer
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>
      <div className="mt-3 text-teal-600 dark:text-teal-400 text-sm font-medium">Read more →</div>
    </Link>
  );
}

export default function RightsHub() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rights', q, category],
    queryFn: () => getRights({ q: q || undefined, category: category === 'All' ? undefined : category }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tenant Rights Hub</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Plain-language guides to your rights as a tenant in Karnataka and Bangalore.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
        ⚠️ <strong>Not legal advice.</strong> These articles are for general information only. Laws change. Always consult a qualified advocate for your specific situation.
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search rights articles..."
          className="input flex-1"
          aria-label="Search rights articles"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-500 dark:text-red-400">
          Failed to load articles. Is the API running?
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            {data.data.length} article{data.data.length !== 1 ? 's' : ''} found
          </p>
          {data.data.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-slate-600 dark:text-slate-400">No articles found for your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Official links */}
      <div className="mt-12 card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Official Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Karnataka Rent Act 1999', url: 'https://indiacode.nic.in/handle/123456789/4475' },
            { label: 'Kaveri Online Services', url: 'https://kaverionline.karnataka.gov.in' },
            { label: 'BBMP (Bruhat Bengaluru Mahanagara Palike)', url: 'https://bbmp.gov.in' },
            { label: 'Karnataka Stamps & Registration', url: 'https://stamps.karnataka.gov.in' },
            { label: 'BESCOM Consumer Portal', url: 'https://bescom.org' },
            { label: 'High Court of Karnataka', url: 'https://hckinfo.karnataka.gov.in' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span>↗</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
