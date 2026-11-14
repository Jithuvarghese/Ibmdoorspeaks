import { describe, it, expect } from 'vitest';
import { retrieveContext } from '../src/rag.js';
import { vi } from 'vitest';

// Mock the RightsRepo since we don't want a real DB in unit tests
vi.mock('../src/repository.js', () => ({
  RightsRepo: {
    findAll: vi.fn().mockResolvedValue([
      {
        id: '1',
        slug: 'security-deposit-return',
        title: 'Security Deposit Return',
        category: 'Deposits',
        excerpt: 'Your landlord must return your security deposit. Deductions allowed for actual damage.',
        content: 'Full article about deposit return in Bangalore under Karnataka Rent Act 1999.',
        officialLinks: [],
        needsLawyerVerification: false,
      },
      {
        id: '2',
        slug: 'eviction-notice',
        title: 'Eviction Notice Periods',
        category: 'Eviction',
        excerpt: 'Landlord must give proper notice before eviction. Minimum 1 month for month-to-month.',
        content: 'Full article about eviction procedures in Karnataka.',
        officialLinks: [],
        needsLawyerVerification: false,
      },
      {
        id: '3',
        slug: 'rent-increase-rules',
        title: 'Rent Increase Rules',
        category: 'Rent',
        excerpt: 'Your landlord cannot increase rent during a lease term.',
        content: 'Full article about rent increase rules under Karnataka law.',
        officialLinks: [],
        needsLawyerVerification: false,
      },
    ]),
  },
}));

describe('RAG retrieveContext', () => {
  it('returns deposit article for deposit query', async () => {
    const results = await retrieveContext('Can my landlord keep my deposit?', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.slug).toBe('security-deposit-return');
  });

  it('returns eviction article for eviction query', async () => {
    const results = await retrieveContext('eviction notice period', 3);
    expect(results.some((r) => r.slug === 'eviction-notice')).toBe(true);
  });

  it('returns at most topK results', async () => {
    const results = await retrieveContext('rent deposit eviction', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('returns empty array for irrelevant query', async () => {
    const results = await retrieveContext('xyz abc qrs', 3);
    expect(results.length).toBe(0);
  });
});
