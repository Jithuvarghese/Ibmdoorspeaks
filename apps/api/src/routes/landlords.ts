import type { FastifyPluginAsync } from 'fastify';
import { LandlordRepo, PropertyRepo, ReviewRepo } from '../repository.js';

export const landlordRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/landlords
  fastify.get('/landlords', async (request, reply) => {
    const { q, locality, minRating, sort, page = '1' } = request.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = 12;

    const { data, total } = await LandlordRepo.search({
      q,
      locality,
      minRating: minRating ? parseFloat(minRating) : undefined,
      sort,
      page: pageNum,
      limit,
    });

    return reply.send({
      data,
      pagination: {
        page: pageNum,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // GET /api/landlords/:id
  fastify.get('/landlords/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const landlord = await LandlordRepo.findById(id);
    if (!landlord) {
      return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Landlord not found' } });
    }
    const properties = await PropertyRepo.findByLandlord(id);
    const { data: reviews, total } = await ReviewRepo.findByLandlord(id);

    // Compute rating breakdown
    const breakdown = {
      maintenance: 0,
      depositReturn: 0,
      privacyRespect: 0,
      rentIncreaseFairness: 0,
      communication: 0,
    };
    if (reviews.length > 0) {
      for (const r of reviews) {
        breakdown.maintenance += r.ratings.maintenance;
        breakdown.depositReturn += r.ratings.depositReturn;
        breakdown.privacyRespect += r.ratings.privacyRespect;
        breakdown.rentIncreaseFairness += r.ratings.rentIncreaseFairness;
        breakdown.communication += r.ratings.communication;
      }
      const len = reviews.length;
      breakdown.maintenance = Math.round((breakdown.maintenance / len) * 10) / 10;
      breakdown.depositReturn = Math.round((breakdown.depositReturn / len) * 10) / 10;
      breakdown.privacyRespect = Math.round((breakdown.privacyRespect / len) * 10) / 10;
      breakdown.rentIncreaseFairness = Math.round((breakdown.rentIncreaseFairness / len) * 10) / 10;
      breakdown.communication = Math.round((breakdown.communication / len) * 10) / 10;
    }

    return reply.send({ landlord, properties, reviews, total, ratingBreakdown: breakdown });
  });
};
