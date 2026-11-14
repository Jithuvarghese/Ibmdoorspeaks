import type { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { ReviewSubmitSchema } from '@doorspeaks/shared';
import { ReviewRepo, LandlordRepo } from '../repository.js';
import { containsPII, containsProfanity } from '../llm.js';

export const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/reviews
  fastify.post('/reviews', async (request, reply) => {
    const parsed = ReviewSubmitSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues.map((i) => i.message).join('; ') },
      });
    }
    const data = parsed.data;

    // PII / profanity check
    if (containsPII(data.freeText)) {
      return reply.status(400).send({
        error: {
          code: 'PII_DETECTED',
          message: 'Your review appears to contain personal contact information (phone number, Aadhaar, or email). Please remove it and resubmit.',
        },
      });
    }
    if (containsProfanity(data.freeText)) {
      return reply.status(400).send({
        error: {
          code: 'PROFANITY_DETECTED',
          message: 'Please keep your review respectful and factual.',
        },
      });
    }

    // Resolve or create landlord
    let landlordId = data.landlordId;
    if (!landlordId && data.newLandlordName) {
      const id = uuidv4();
      await LandlordRepo.upsertName(data.newLandlordName, id);
      landlordId = id;
    }
    if (!landlordId) {
      return reply.status(400).send({
        error: { code: 'MISSING_LANDLORD', message: 'Landlord ID or name required' },
      });
    }

    // Verify landlord exists
    const landlord = await LandlordRepo.findById(landlordId);
    if (!landlord) {
      return reply.status(404).send({
        error: { code: 'NOT_FOUND', message: 'Landlord not found' },
      });
    }

    const review = {
      id: uuidv4(),
      landlordId,
      locality: data.locality,
      bhk: data.bhk,
      rentPerMonth: data.rentPerMonth,
      tenancyStart: data.tenancyStart,
      tenancyEnd: data.tenancyEnd,
      ratings: data.ratings,
      depositAmount: data.depositAmount,
      depositReturned: data.depositReturned,
      freeText: data.freeText,
      anonymous: data.anonymous,
      wouldRentAgain: data.wouldRentAgain,
      moderationStatus: 'pending' as const,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    await ReviewRepo.insert(review);

    return reply.status(201).send({
      success: true,
      reviewId: review.id,
      message: 'Review submitted for moderation. It will appear after approval.',
    });
  });

  // GET /api/reviews (by landlord)
  fastify.get('/reviews', async (request, reply) => {
    const { landlordId, page = '1' } = request.query as Record<string, string>;
    if (!landlordId) {
      return reply.status(400).send({
        error: { code: 'MISSING_PARAM', message: 'landlordId required' },
      });
    }
    const pageNum = parseInt(page, 10) || 1;
    const { data, total } = await ReviewRepo.findByLandlord(landlordId, pageNum);
    return reply.send({ data, total, page: pageNum });
  });
};
