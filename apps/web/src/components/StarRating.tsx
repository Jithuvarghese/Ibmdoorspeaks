interface Props {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  showText?: boolean;
}

export default function StarRating({ value, max = 5, size = 'md', showText = true }: Props) {
  const filled = Math.round(value);
  const starSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <span className="inline-flex items-center gap-1">
      <span className={starSize} aria-hidden="true">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={i < filled ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}>
            ★
          </span>
        ))}
      </span>
      {showText && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
