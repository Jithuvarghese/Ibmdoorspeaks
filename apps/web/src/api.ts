import type {
  Landlord,
  Review,
  ReviewSubmit,
  DepositCheckRequest,
  DepositCheckResult,
  RightsArticle,
  Locality,
  RentFairnessRequest,
  RentFairnessResult,
  ChatMessage,
  Pagination,
  Report,
} from '@doorspeaks/shared';

const BASE = '/api';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json() as T;
  if (!res.ok) {
    const err = data as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `Request failed: ${res.status}`);
  }
  return data;
}

// ─── Landlords ────────────────────────────────────────────────────────────────

export type LandlordSearchParams = {
  q?: string;
  locality?: string;
  minRating?: number;
  sort?: string;
  page?: number;
};

export type LandlordSearchResult = {
  data: Landlord[];
  pagination: Pagination;
};

export function searchLandlords(params: LandlordSearchParams): Promise<LandlordSearchResult> {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.locality) sp.set('locality', params.locality);
  if (params.minRating) sp.set('minRating', String(params.minRating));
  if (params.sort) sp.set('sort', params.sort);
  if (params.page) sp.set('page', String(params.page));
  return fetchJson(`${BASE}/landlords?${sp.toString()}`);
}

export type LandlordDetailResult = {
  landlord: Landlord;
  properties: import('@doorspeaks/shared').Property[];
  reviews: Review[];
  total: number;
  ratingBreakdown: {
    maintenance: number;
    depositReturn: number;
    privacyRespect: number;
    rentIncreaseFairness: number;
    communication: number;
  };
};

export function getLandlord(id: string): Promise<LandlordDetailResult> {
  return fetchJson(`${BASE}/landlords/${id}`);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function submitReview(data: ReviewSubmit): Promise<{ success: boolean; reviewId: string }> {
  return fetchJson(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ─── Deposit ──────────────────────────────────────────────────────────────────

export function checkDeposit(data: DepositCheckRequest): Promise<DepositCheckResult> {
  return fetchJson(`${BASE}/deposit-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function checkRentFairness(data: RentFairnessRequest): Promise<RentFairnessResult> {
  return fetchJson(`${BASE}/rent-fairness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ─── Rights ───────────────────────────────────────────────────────────────────

export type RightsListItem = Omit<RightsArticle, 'content'>;

export function getRights(params?: { q?: string; category?: string }): Promise<{ data: RightsListItem[] }> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.category) sp.set('category', params.category);
  return fetchJson(`${BASE}/rights?${sp.toString()}`);
}

export function getRightsArticle(slug: string): Promise<RightsArticle> {
  return fetchJson(`${BASE}/rights/${slug}`);
}

// ─── Localities ───────────────────────────────────────────────────────────────

export function getLocalities(): Promise<{ data: Locality[] }> {
  return fetchJson(`${BASE}/localities`);
}

export function getLocality(slug: string): Promise<Locality> {
  return fetchJson(`${BASE}/localities/${slug}`);
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function submitReport(data: Report): Promise<{ success: boolean }> {
  return fetchJson(`${BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ─── Chat (SSE) ───────────────────────────────────────────────────────────────

export type ChatEvent =
  | { type: 'text'; text: string }
  | { type: 'sources'; sources: { slug: string; title: string }[] }
  | { type: 'done' }
  | { type: 'error'; error: string };

export function streamChat(
  messages: ChatMessage[],
  onEvent: (event: ChatEvent) => void
): () => void {
  let cancelled = false;

  (async () => {
    try {
      const res = await fetch(`${BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        onEvent({ type: 'error', error: `API error: ${res.status}` });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        onEvent({ type: 'error', error: 'No response body' });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const json = line.slice(6);
            try {
              const event = JSON.parse(json) as ChatEvent;
              onEvent(event);
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err) {
      if (!cancelled) {
        onEvent({ type: 'error', error: 'Failed to connect to chat API' });
      }
    }
  })();

  return () => {
    cancelled = true;
  };
}
