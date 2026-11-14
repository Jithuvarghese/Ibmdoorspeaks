import type { Review } from '@doorspeaks/shared';
import StarRating from './StarRating';

interface Props {
  review: Review;
}

const RATING_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  depositReturn: 'Deposit Return',
  privacyRespect: 'Privacy',
  rentIncreaseFairness: 'Rent Fairness',
  communication: 'Communication',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
}

export default function ReviewCard({ review }: Props) {
  const avg =
    (review.ratings.maintenance +
      review.ratings.depositReturn +
      review.ratings.privacyRespect +
      review.ratings.rentIncreaseFairness +
      review.ratings.communication) /
    5;

  const depositRatio =
    review.depositAmount > 0 ? review.depositReturned / review.depositAmount : null;

  return (
    <div className="card p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <StarRating value={avg} size="sm" />
          {review.isDemo && <span className="demo-banner">DEMO</span>}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
          <span>{review.bhk} BHK · {review.locality}</span>
          <br />
          <span>₹{review.rentPerMonth.toLocaleString('en-IN')}/mo</span>
          {review.tenancyStart && (
            <>
              {' · '}
              {formatDate(review.tenancyStart)}
              {review.tenancyEnd && ` – ${formatDate(review.tenancyEnd)}`}
            </>
          )}
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(review.ratings).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded px-2 py-1">
            <span>{RATING_LABELS[key] ?? key}</span>
            <StarRating value={val} size="sm" showText={false} />
          </div>
        ))}
      </div>

      {/* Free text */}
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        "{review.freeText}"
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-700">
        {review.anonymous ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">Anonymous tenant</span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">Verified tenant</span>
        )}
        {depositRatio !== null && (
          <span className={`text-xs font-medium ${depositRatio >= 0.9 ? 'text-green-600 dark:text-green-400' : depositRatio >= 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            Deposit returned: {Math.round(depositRatio * 100)}%
          </span>
        )}
        {review.wouldRentAgain && (
          <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">✓ Would rent again</span>
        )}
      </div>
    </div>
  );
}
