import type { FastifyPluginAsync } from 'fastify';
import { DepositCheckRequestSchema, RentFairnessRequestSchema } from '@doorspeaks/shared';
import { checkDeposit, FURNISHING_MULTIPLIER } from '../depositRules.js';
import { LocalityRepo } from '../repository.js';

export const depositRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/deposit-check
  fastify.post('/deposit-check', async (request, reply) => {
    const parsed = DepositCheckRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues.map((i) => i.message).join('; '),
        },
      });
    }
    const result = checkDeposit(parsed.data);
    return reply.send(result);
  });

  // POST /api/rent-fairness
  fastify.post('/rent-fairness', async (request, reply) => {
    const parsed = RentFairnessRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues.map((i) => i.message).join('; '),
        },
      });
    }
    const { locality, bhk, furnishing, quotedRent } = parsed.data;

    const loc = await LocalityRepo.findBySlug(locality.toLowerCase().replace(/\s+/g, '-'));
    if (!loc) {
      return reply.status(404).send({
        error: { code: 'NOT_FOUND', message: 'Locality not found. Try using the locality slug.' },
      });
    }

    const range = loc.rentRanges.find((r) => r.bhk === bhk);
    if (!range) {
      return reply.status(404).send({
        error: { code: 'NOT_FOUND', message: `No rent data for ${bhk} BHK in ${loc.name}` },
      });
    }

    const mult = FURNISHING_MULTIPLIER(furnishing);
    const fairMin = Math.round(range.min * mult);
    const fairMax = Math.round(range.max * mult);
    const midPoint = (fairMin + fairMax) / 2;
    const percentDiff = Math.round(((quotedRent - midPoint) / midPoint) * 100);

    let verdict: 'Below market' | 'Within market' | 'Above market';
    let advice: string;
    if (quotedRent < fairMin) {
      verdict = 'Below market';
      advice = `Great deal! ₹${quotedRent.toLocaleString('en-IN')} is below the market range of ₹${fairMin.toLocaleString('en-IN')}–₹${fairMax.toLocaleString('en-IN')} for ${bhk} BHK ${furnishing} in ${loc.name}. Confirm the property condition before signing.`;
    } else if (quotedRent > fairMax) {
      verdict = 'Above market';
      advice = `₹${quotedRent.toLocaleString('en-IN')} is above the market range of ₹${fairMin.toLocaleString('en-IN')}–₹${fairMax.toLocaleString('en-IN')}. Try negotiating — cite DoorSpeaks locality data and similar listings.`;
    } else {
      verdict = 'Within market';
      advice = `₹${quotedRent.toLocaleString('en-IN')} is within the fair market range of ₹${fairMin.toLocaleString('en-IN')}–₹${fairMax.toLocaleString('en-IN')} for ${bhk} BHK ${furnishing} in ${loc.name}.`;
    }

    return reply.send({ fairRangeMin: fairMin, fairRangeMax: fairMax, quotedRent, verdict, percentDiff, advice });
  });
};
