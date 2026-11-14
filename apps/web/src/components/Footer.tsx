import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-lg mb-2">🚪 DoorSpeaks</div>
            <p className="text-sm">{t('home.tagline')}</p>
            <p className="text-xs mt-2 text-slate-500">Bangalore's tenant-first rental platform</p>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Platform</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/landlords" className="hover:text-teal-400 transition-colors">Search Landlords</Link></li>
              <li><Link to="/deposit-check" className="hover:text-teal-400 transition-colors">Deposit Check</Link></li>
              <li><Link to="/rights" className="hover:text-teal-400 transition-colors">Tenant Rights</Link></li>
              <li><Link to="/localities" className="hover:text-teal-400 transition-colors">Localities</Link></li>
              <li><Link to="/chat" className="hover:text-teal-400 transition-colors">AI Chat</Link></li>
              <li><Link to="/write-review" className="hover:text-teal-400 transition-colors">Write a Review</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.karnataka.gov.in/pages/rentact" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">Karnataka Rent Act 1999 ↗</a></li>
              <li><a href="https://kaverionline.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">Kaveri Online Services ↗</a></li>
              <li><a href="https://bbmp.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">BBMP ↗</a></li>
              <li><Link to="/compare" className="hover:text-teal-400 transition-colors">Compare Localities</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 space-y-2">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('footer.disclaimer')}
          </p>
          <p className="text-xs text-slate-600">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
