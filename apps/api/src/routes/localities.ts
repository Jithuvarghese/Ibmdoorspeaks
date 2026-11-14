import type { FastifyPluginAsync } from 'fastify';
import { LocalityRepo } from '../repository.js';

export const localityRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/localities
  fastify.get('/localities', async (_request, reply) => {
    const localities = await LocalityRepo.findAll();
    return reply.send({ data: localities });
  });

  // GET /api/localities/:slug
  fastify.get('/localities/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const locality = await LocalityRepo.findBySlug(slug);
    if (!locality) {
      return reply.status(404).send({
        error: { code: 'NOT_FOUND', message: 'Locality not found' },
      });
    }
    return reply.send(locality);
  });
};
