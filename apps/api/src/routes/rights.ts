import type { FastifyPluginAsync } from 'fastify';
import { RightsRepo } from '../repository.js';

export const rightsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/rights
  fastify.get('/rights', async (request, reply) => {
    const { q, category } = request.query as Record<string, string>;
    let articles = await RightsRepo.findAll();

    if (category) {
      articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    if (q) {
      const ql = q.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(ql) ||
          a.excerpt.toLowerCase().includes(ql) ||
          a.content.toLowerCase().includes(ql)
      );
    }

    // Don't return full content in list
    return reply.send({
      data: articles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        excerpt: a.excerpt,
        needsLawyerVerification: a.needsLawyerVerification,
        officialLinks: a.officialLinks,
      })),
    });
  });

  // GET /api/rights/:slug
  fastify.get('/rights/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const article = await RightsRepo.findBySlug(slug);
    if (!article) {
      return reply.status(404).send({
        error: { code: 'NOT_FOUND', message: 'Article not found' },
      });
    }
    return reply.send(article);
  });
};
