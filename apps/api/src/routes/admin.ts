import type { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { ReportSchema } from '@doorspeaks/shared';
import { ReportRepo, ReviewRepo } from '../repository.js';

export const reportRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/reports
  fastify.post('/reports', async (request, reply) => {
    const parsed = ReportSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues.map((i) => i.message).join('; '),
        },
      });
    }
    const report = {
      id: uuidv4(),
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
      details: parsed.data.details,
      createdAt: new Date().toISOString(),
    };
    await ReportRepo.insert(report);
    return reply.status(201).send({ success: true, reportId: report.id });
  });
};

// ─── Admin routes ─────────────────────────────────────────────────────────────

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // Auth hook
  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.headers['x-admin-token'] as string | undefined;
    const expected = process.env['ADMIN_TOKEN'] ?? 'changeme-admin-secret';
    if (token !== expected) {
      return reply.status(401).send({
        error: { code: 'UNAUTHORIZED', message: 'Invalid or missing admin token' },
      });
    }
  });

  // GET /api/admin/reviews
  fastify.get('/admin/reviews', async (_request, reply) => {
    const reviews = await ReviewRepo.pending();
    return reply.send({ data: reviews });
  });

  // PATCH /api/admin/reviews/:id
  fastify.patch('/admin/reviews/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status?: string };
    if (!status || !['approved', 'rejected'].includes(status)) {
      return reply.status(400).send({
        error: { code: 'INVALID_STATUS', message: 'Status must be approved or rejected' },
      });
    }
    const review = await ReviewRepo.findById(id);
    if (!review) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Review not found' } });
    }
    await ReviewRepo.updateStatus(id, status as 'approved' | 'rejected');

    // Recompute landlord stats
    const { LandlordRepo } = await import('../repository.js');
    await LandlordRepo.updateStats(review.landlordId);

    return reply.send({ success: true });
  });
};
