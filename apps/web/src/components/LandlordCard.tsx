import { Link } from 'react-router-dom';
import type { Landlord } from '@doorspeaks/shared';
import StarRating from './StarRating';

interface Props {
  landlord: Landlord;
}

const BADGE_COLORS: Record<string, string> = {
  'Rated by 5+ tenants': 'bg-teal-50 text-teal-700 border-teal-200',
  'Prompt deposit returner': 'bg-green-50 text-green-700 border-green-200',
  'Verified tenant review': 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function LandlordCard({ landlord }: Props) {
  return (
    <Link
      to={`/landlords/${landlord.id}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            {landlord.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {landlord.localities.slice(0, 3).join(' · ')}
            {landlord.localities.length > 3 && ` +${landlord.localities.length - 3} more`}
          </p>
        </div>
        {landlord.isDemo && (
          <span className="demo-banner shrink-0">DEMO</span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <StarRating value={landlord.avgRating} size="sm" />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {landlord.reviewCount} review{landlord.reviewCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Badges */}
      {landlord.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {landlord.badges.map((badge) => (
            <span
              key={badge}
              className={`badge border ${BADGE_COLORS[badge] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}
            >
              {badge === 'Prompt deposit returner' ? '✓ ' : badge === 'Rated by 5+ tenants' ? '★ ' : '🔒 '}
              {badge}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
