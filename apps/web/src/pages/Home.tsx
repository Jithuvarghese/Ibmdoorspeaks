import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FEATURES = [
  {
    icon: '🏠',
    key: 'landlords',
    href: '/landlords',
    color: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 hover:border-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-800',
  },
  {
    icon: '💰',
    key: 'deposit',
    href: '/deposit-check',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:border-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-800',
  },
  {
    icon: '📚',
    key: 'rights',
    href: '/rights',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
  },
  {
    icon: '🤖',
    key: 'ai',
    href: '/chat',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:border-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-800',
  },
];

const STEPS = [
  { num: '1', en: 'Search for your landlord or locality', icon: '🔍' },
  { num: '2', en: 'Read verified tenant reviews', icon: '⭐' },
  { num: '3', en: 'Check your deposit and rights', icon: '✅' },
  { num: '4', en: 'Make an informed decision', icon: '🤝' },
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/landlords?q=${encodeURIComponent(q.trim())}`);
    else navigate('/landlords');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 inline-block bg-amber-500/20 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium border border-amber-500/30">
            🚪 Bangalore's Tenant Transparency Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {t('home.tagline')}
          </h1>
          <p className="text-teal-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="flex-1 bg-transparent text-white placeholder-teal-200 outline-none px-3 py-2 text-sm sm:text-base"
                aria-label="Search landlords"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors shrink-0"
              >
                {t('home.searchBtn')}
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link to="/landlords?locality=Koramangala" className="text-teal-200 hover:text-white transition-colors">Koramangala</Link>
            <span className="text-teal-500">·</span>
            <Link to="/landlords?locality=Indiranagar" className="text-teal-200 hover:text-white transition-colors">Indiranagar</Link>
            <span className="text-teal-500">·</span>
            <Link to="/landlords?locality=Whitefield" className="text-teal-200 hover:text-white transition-colors">Whitefield</Link>
            <span className="text-teal-500">·</span>
            <Link to="/landlords?locality=HSR+Layout" className="text-teal-200 hover:text-white transition-colors">HSR Layout</Link>
            <span className="text-teal-500">·</span>
            <Link to="/landlords?locality=Electronic+City" className="text-teal-200 hover:text-white transition-colors">Electronic City</Link>
          </div>
        </div>
      </section>

      {/* Feature tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">
          Everything you need as a tenant in Bangalore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <Link
              key={f.key}
              to={f.href}
              className={`card p-6 border flex flex-col gap-3 hover:shadow-md transition-all ${f.color}`}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  {t(`home.features.${f.key}.title`)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t(`home.features.${f.key}.desc`)}
                </p>
              </div>
              <span className="text-teal-600 dark:text-teal-400 text-sm font-medium mt-auto">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">
            {t('home.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  {step.icon}
                </div>
                <div className="bg-teal-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-2">
                  {step.num}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{step.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / social proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">25+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Landlords tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">60+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tenant reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">30+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Bangalore localities</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">12</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Rights articles</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-800 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Had a good (or bad) landlord experience?</h2>
          <p className="text-teal-200 mb-6">Your review helps the next tenant make an informed decision. It takes under 3 minutes.</p>
          <Link to="/write-review" className="btn-amber text-base inline-block">
            Write a Review
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 py-4 px-4">
        <p className="max-w-4xl mx-auto text-xs text-amber-800 dark:text-amber-300 text-center">
          {t('home.disclaimer')}
        </p>
      </section>
    </div>
  );
}
