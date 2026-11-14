import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Logo = () => (
  <svg viewBox="0 0 120 120" width="36" height="36" aria-hidden="true">
    <rect x="30" y="30" width="50" height="70" rx="4" fill="#0f766e" />
    <rect x="35" y="35" width="40" height="60" rx="2" fill="#134e4a" />
    <circle cx="68" cy="66" r="4" fill="#f59e0b" />
    <ellipse cx="90" cy="28" rx="22" ry="16" fill="#f59e0b" />
    <polygon points="75,36 68,46 82,40" fill="#f59e0b" />
    <circle cx="82" cy="28" r="2.5" fill="#fff" />
    <circle cx="90" cy="28" r="2.5" fill="#fff" />
    <circle cx="98" cy="28" r="2.5" fill="#fff" />
  </svg>
);

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'kn', label: 'ಕ' },
  { code: 'hi', label: 'हि' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/landlords', label: t('nav.landlords') },
    { to: '/deposit-check', label: t('nav.depositCheck') },
    { to: '/rights', label: t('nav.rights') },
    { to: '/localities', label: t('nav.localities') },
    { to: '/chat', label: t('nav.aiChat') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400 text-xl">
            <Logo />
            DoorSpeaks
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="hidden md:flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => void i18n.changeLanguage(lang.code)}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  aria-label={`Switch to ${lang.code}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* Write review CTA */}
            <button
              onClick={() => navigate('/write-review')}
              className="hidden md:block btn-amber text-sm py-2 px-4"
            >
              {t('nav.writeReview')}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm rounded-lg mb-1 transition-colors ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/write-review"
              className="block mt-2 btn-amber text-sm text-center"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.writeReview')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
