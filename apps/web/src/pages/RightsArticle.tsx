import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRightsArticle } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

// Very simple markdown renderer (no external dep)
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const html: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      html.push(`<h1>${line.slice(2)}</h1>`);
    } else if (line.startsWith('## ')) {
      html.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      html.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith('| ')) {
      html.push(`<tr>${line.split('|').filter((c) => c.trim()).map((c) => `<td>${c.trim()}</td>`).join('')}</tr>`);
    } else if (line.startsWith('---')) {
      // skip separator rows
    } else if (line.startsWith('- ') || line.startsWith('✅') || line.startsWith('❌')) {
      html.push(`<li>${line.replace(/^- /, '')}</li>`);
    } else if (/^\d+\./.test(line)) {
      html.push(`<li>${line.replace(/^\d+\. /, '')}</li>`);
    } else if (line.startsWith('> ')) {
      html.push(`<blockquote>${line.slice(2)}</blockquote>`);
    } else if (line.trim() === '') {
      html.push('<br/>');
    } else {
      // Inline formatting
      let text = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      html.push(`<p>${text}</p>`);
    }
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html.join('\n') }}
    />
  );
}

export default function RightsArticle() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['rights', slug],
    queryFn: () => getRightsArticle(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  }

  if (isError || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Article not found</h2>
        <Link to="/rights" className="btn-primary mt-4 inline-block">Back to Rights Hub</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/rights" className="hover:text-teal-600 dark:hover:text-teal-400">Rights Hub</Link>
        {' › '}
        <span>{article.category}</span>
        {' › '}
        <span className="text-slate-700 dark:text-slate-300">{article.title}</span>
      </nav>

      {/* Disclaimers */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-300">
        ⚠️ <strong>Not legal advice.</strong> This article is for general information only. Laws change. Always consult a qualified advocate for your specific situation.
      </div>

      {article.needsLawyerVerification && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6 text-sm text-orange-800 dark:text-orange-300">
          🔖 <strong>Lawyer verification recommended.</strong> This article covers a complex area of law. Consult a lawyer before taking legal action.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <span className="badge bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 mb-3 inline-block">
          {article.category}
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{article.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">{article.excerpt}</p>
      </div>

      {/* Content */}
      <div className="card p-6 sm:p-8 mb-8">
        <SimpleMarkdown content={article.content} />
      </div>

      {/* Official links */}
      {article.officialLinks.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Official Sources</h3>
          <ul className="space-y-2">
            {article.officialLinks.map((link) => (
              <li key={link}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 text-sm hover:underline flex items-center gap-1">
                  <span>↗</span> {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between">
        <Link to="/rights" className="btn-secondary text-sm">← Back to Rights Hub</Link>
        <Link to="/chat" className="btn-primary text-sm">Ask AI about this →</Link>
      </div>
    </div>
  );
}
