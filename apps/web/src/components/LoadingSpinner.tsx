interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: Props) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div
      className={`inline-block ${sizeClass} border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
