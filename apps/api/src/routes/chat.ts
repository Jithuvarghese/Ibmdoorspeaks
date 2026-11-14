import type { FastifyPluginAsync } from 'fastify';
import { ChatRequestSchema } from '@doorspeaks/shared';
import { createLLMProvider } from '../llm.js';
import { retrieveContext } from '../rag.js';

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/chat  (Server-Sent Events streaming)
  fastify.post('/chat', async (request, reply) => {
    const parsed = ChatRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues.map((i) => i.message).join('; '),
        },
      });
    }

    const messages = parsed.data.messages;
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content ?? '';

    // RAG: retrieve top-3 relevant articles
    const contextArticles = await retrieveContext(lastUserMsg, 3);
    const contextText = contextArticles
      .map((a) => `### ${a.title}\n${a.excerpt}`)
      .join('\n\n');

    // Set SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Send sources first
    if (contextArticles.length > 0) {
      const sourcesPayload = JSON.stringify({
        type: 'sources',
        sources: contextArticles.map((a) => ({ slug: a.slug, title: a.title })),
      });
      reply.raw.write(`data: ${sourcesPayload}\n\n`);
    }

    const provider = createLLMProvider();
    await provider.stream(messages, contextText, (chunk) => {
      if ('error' in chunk) {
        const payload = JSON.stringify({ type: 'error', error: chunk.error });
        reply.raw.write(`data: ${payload}\n\n`);
        reply.raw.end();
      } else if ('done' in chunk) {
        reply.raw.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        reply.raw.end();
      } else {
        const payload = JSON.stringify({ type: 'text', text: chunk.text });
        reply.raw.write(`data: ${payload}\n\n`);
      }
    });
  });
};
