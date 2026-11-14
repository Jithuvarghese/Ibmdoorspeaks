import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🚪</div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The door you're looking for doesn't exist. Let's get you back home.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
