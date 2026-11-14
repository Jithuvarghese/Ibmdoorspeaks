import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { landlordRoutes } from './routes/landlords.js';
import { reviewRoutes } from './routes/reviews.js';
import { depositRoutes } from './routes/deposit.js';
import { rightsRoutes } from './routes/rights.js';
import { chatRoutes } from './routes/chat.js';
import { localityRoutes } from './routes/localities.js';
import { reportRoutes, adminRoutes } from './routes/admin.js';

const PORT = parseInt(process.env['PORT'] ?? '4000', 10);

const app = Fastify({
  logger: process.env['NODE_ENV'] !== 'test',
});

// ─── Plugins ──────────────────────────────────────────────────────────────────

await app.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', async () => ({
  status: 'ok',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
}));

// ─── Routes ───────────────────────────────────────────────────────────────────

await app.register(landlordRoutes, { prefix: '/api' });
await app.register(reviewRoutes, { prefix: '/api' });
await app.register(depositRoutes, { prefix: '/api' });
await app.register(rightsRoutes, { prefix: '/api' });
await app.register(chatRoutes, { prefix: '/api' });
await app.register(localityRoutes, { prefix: '/api' });
await app.register(reportRoutes, { prefix: '/api' });
await app.register(adminRoutes, { prefix: '/api' });

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);
  reply.status(500).send({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚪 DoorSpeaks API running at http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
