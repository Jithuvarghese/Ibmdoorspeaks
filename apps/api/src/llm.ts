import type { ChatMessage } from '@doorspeaks/shared';

const SYSTEM_PROMPT = `You are DoorSpeaks Assistant, a helpful guide for tenants in Bangalore, India.
Your purpose: provide practical, plain-language guidance on renting in Bangalore and Karnataka.
Always add: "⚠️ This is general information, not legal advice. Consult a qualified advocate for your specific situation."
Refuse to help with: forging documents, harassing landlords, illegal acts, sharing personal data of landlords or tenants.
Answer in English, Kannada (ಕನ್ನಡ), or Hindi based on the user's language.
Be concise, empathetic, and factual. Cite Karnataka Rent Act 1999 and BBMP rules when relevant.`;

// ─── Provider interface ───────────────────────────────────────────────────────

export type StreamChunk = { text: string } | { done: true } | { error: string };

export interface LLMProvider {
  stream(
    messages: ChatMessage[],
    context: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void>;
}

// ─── Mock provider ────────────────────────────────────────────────────────────

const MOCK_RESPONSES: Record<string, string> = {
  default: `Thanks for your question! Here's some general guidance for Bangalore tenants:

**Security Deposit:** Market norms in Bangalore range from 2–10 months' rent depending on the locality. Premium areas like Koramangala and Indiranagar see 6–10 months; outer areas like Electronic City see 2–5 months. This is a market norm, not a legal cap.

**Your Rights:** Under the Karnataka Rent Act 1999:
- Landlord must return your deposit within a reasonable time (typically 1–2 months) after vacating
- Deductions allowed only for actual damages beyond normal wear and tear
- Landlord cannot enter without notice (24 hours is good practice)
- Rent increase must be mutually agreed; unilateral hikes are challengeable

**If in dispute:** You can approach the Rent Control Authority / Rent Court in your jurisdiction.

⚠️ This is general information, not legal advice. Consult a qualified advocate for your specific situation.`,

  deposit: `**Can your landlord keep your full deposit?**

In Bangalore, your landlord can make deductions from your deposit for:
✅ Actual damage to property (beyond normal wear and tear)
✅ Unpaid rent or utility bills
✅ Agreed cleaning costs (only if stipulated in agreement)

Your landlord **cannot** deduct for:
❌ Normal wear and tear (paint fading, minor scuffs)
❌ Routine maintenance (leaking taps, bulb replacements)
❌ "Repainting" unless the walls are genuinely damaged

**Steps to protect yourself:**
1. Do a joint move-out inspection with photos
2. Send a written demand letter after 60 days if not returned
3. If refused, file in Rent Court (small claims process, no lawyer needed for small amounts)
4. For amounts above ₹1 lakh, consult an advocate

⚠️ This is general information, not legal advice. Consult a qualified advocate for your specific situation.`,

  eviction: `**Eviction notice periods in Bangalore (Karnataka Rent Act 1999):**

Landlords must give proper notice before asking you to vacate:
- **Month-to-month tenancy:** 1 month's notice
- **Fixed-term lease:** As per agreement; at least 1 month notice at end of term
- **Non-payment of rent:** Notice to pay within 15 days, then eviction proceedings

**Protected grounds for eviction:**
- Non-payment of rent after valid notice
- Subletting without consent
- Use of property for illegal purposes
- Landlord needs property for personal use (but must prove genuine need)

**Illegal eviction:** Landlord cannot cut off water/electricity, change locks, or forcibly remove belongings. This is a criminal offence.

If facing illegal eviction, call the police and file a complaint at your local police station.

⚠️ This is general information, not legal advice. Consult a qualified advocate for your specific situation.`,
};

export class MockProvider implements LLMProvider {
  async stream(
    messages: ChatMessage[],
    context: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const lastMsg = messages[messages.length - 1]?.content.toLowerCase() ?? '';
    let response: string;

    if (lastMsg.includes('deposit') || lastMsg.includes('security')) {
      response = MOCK_RESPONSES['deposit'] ?? MOCK_RESPONSES['default'] ?? '';
    } else if (lastMsg.includes('evict') || lastMsg.includes('notice') || lastMsg.includes('vacate')) {
      response = MOCK_RESPONSES['eviction'] ?? MOCK_RESPONSES['default'] ?? '';
    } else {
      response = MOCK_RESPONSES['default'] ?? '';
    }

    if (context) {
      response += '\n\n*Based on DoorSpeaks rights articles.*';
    }

    // Simulate streaming
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 15));
      onChunk({ text: (i === 0 ? '' : ' ') + (words[i] ?? '') });
    }
    onChunk({ done: true });
  }
}

// ─── Ollama provider ──────────────────────────────────────────────────────────

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async stream(
    messages: ChatMessage[],
    context: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\n--- Relevant context from DoorSpeaks knowledge base ---\n${context}`
      : SYSTEM_PROMPT;

    const ollamaMessages = [
      { role: 'system', content: systemWithContext },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: ollamaMessages,
          stream: true,
        }),
      });

      if (!res.ok) {
        onChunk({ error: `Ollama error: ${res.status} ${res.statusText}` });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        onChunk({ error: 'No response body from Ollama' });
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as {
              message?: { content?: string };
              done?: boolean;
            };
            if (parsed.message?.content) {
              onChunk({ text: parsed.message.content });
            }
            if (parsed.done) {
              onChunk({ done: true });
              return;
            }
          } catch {
            // malformed chunk, skip
          }
        }
      }
    } catch (err) {
      onChunk({ error: `Cannot connect to Ollama at ${this.baseUrl}. Is it running?` });
    }
  }
}

// ─── Gemini provider ──────────────────────────────────────────────────────────

export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async stream(
    messages: ChatMessage[],
    context: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\n--- Context ---\n${context}`
      : SYSTEM_PROMPT;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemWithContext }] },
            contents,
          }),
        }
      );

      if (!res.ok) {
        onChunk({ error: `Gemini error: ${res.status}` });
        return;
      }

      const text = await res.text();
      // Gemini streams as JSON array chunks
      const chunks = text
        .split('\n')
        .filter((l) => l.startsWith('{') || l.startsWith('['));
      for (const chunk of chunks) {
        try {
          const parsed = JSON.parse(chunk) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
          };
          const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          if (content) onChunk({ text: content });
        } catch {
          // skip malformed
        }
      }
      onChunk({ done: true });
    } catch (err) {
      onChunk({ error: 'Cannot connect to Gemini API' });
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createLLMProvider(): LLMProvider {
  const provider = process.env['LLM_PROVIDER'] ?? 'mock';

  if (provider === 'ollama') {
    return new OllamaProvider(
      process.env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434',
      process.env['OLLAMA_MODEL'] ?? 'llama3.1:8b'
    );
  }
  if (provider === 'gemini') {
    const key = process.env['GEMINI_API_KEY'] ?? '';
    const model = process.env['GEMINI_MODEL'] ?? 'gemini-1.5-flash';
    return new GeminiProvider(key, model);
  }
  return new MockProvider();
}

// ─── PII filter ───────────────────────────────────────────────────────────────

export function containsPII(text: string): boolean {
  // Block phone numbers (10-digit Indian)
  if (/\b[6-9]\d{9}\b/.test(text)) return true;
  // Block Aadhaar-like 12-digit numbers
  if (/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(text)) return true;
  // Block email patterns in reviews
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) return true;
  return false;
}

// ─── Profanity filter (basic) ─────────────────────────────────────────────────

const BLOCKED_WORDS = ['fuck', 'shit', 'bastard', 'asshole', 'bitch'];

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((w) => lower.includes(w));
}
