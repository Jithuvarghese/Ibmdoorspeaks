import type { RightsArticle } from '@doorspeaks/shared';
import { RightsRepo } from './repository.js';

// Simple BM25-style keyword scoring for RAG retrieval

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function termFrequency(tokens: string[], term: string): number {
  return tokens.filter((t) => t === term).length;
}

function score(query: string, article: RightsArticle): number {
  const queryTokens = tokenize(query);
  const docTokens = tokenize(article.title + ' ' + article.content + ' ' + article.excerpt);
  const docLen = docTokens.length;
  const avgDocLen = 500;
  const k1 = 1.5;
  const b = 0.75;

  let total = 0;
  for (const qt of queryTokens) {
    const tf = termFrequency(docTokens, qt);
    const idf = Math.log((50 + 1) / (1 + 1));
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
    total += idf * (numerator / denominator);
  }
  return total;
}

export async function retrieveContext(query: string, topK = 3): Promise<RightsArticle[]> {
  const articles = await RightsRepo.findAll();
  return articles
    .map((a) => ({ article: a, score: score(query, a) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((x) => x.score > 0)
    .map((x) => x.article);
}
