import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { landlordRoutes } from '../src/routes/landlords.js';
import { reviewRoutes } from '../src/routes/reviews.js';
import { depositRoutes } from '../src/routes/deposit.js';
import { rightsRoutes } from '../src/routes/rights.js';
import { localityRoutes } from '../src/routes/localities.js';
import { resetDb } from '../src/db.js';
import { LandlordRepo } from '../src/repository.js';
import { v4 as uuidv4 } from 'uuid';

// Use in-memory test database
process.env['DATABASE_PATH'] = ':memory:';

async function buildApp() {
  resetDb();
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await app.register(rateLimit, { max: 1000, timeWindow: '1 minute' });
  await app.register(landlordRoutes, { prefix: '/api' });
  await app.register(reviewRoutes, { prefix: '/api' });
  await app.register(depositRoutes, { prefix: '/api' });
  await app.register(rightsRoutes, { prefix: '/api' });
  await app.register(localityRoutes, { prefix: '/api' });
  app.get('/api/health', async () => ({ status: 'ok' }));
  await app.ready();
  return app;
}

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    it('returns ok', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/health' });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toMatchObject({ status: 'ok' });
      await app.close();
    });
  });

  describe('GET /api/landlords', () => {
    it('returns empty list initially', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/landlords' });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.data)).toBe(true);
      await app.close();
    });

    it('searches by query', async () => {
      const app = await buildApp();
      await LandlordRepo.insert({
        id: uuidv4(),
        name: 'Test Landlord Sharma',
        localities: ['Koramangala'],
        avgRating: 4.2,
        reviewCount: 3,
        badges: [],
        isDemo: true,
        createdAt: new Date().toISOString(),
      });

      const res = await app.inject({
        method: 'GET',
        url: '/api/landlords?q=Sharma',
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0].name).toContain('Sharma');
      await app.close();
    });
  });

  describe('GET /api/landlords/:id', () => {
    it('returns 404 for unknown landlord', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'GET',
        url: '/api/landlords/nonexistent-id',
      });
      expect(res.statusCode).toBe(404);
      await app.close();
    });
  });

  describe('POST /api/deposit-check', () => {
    it('returns a valid deposit check result', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'POST',
        url: '/api/deposit-check',
        payload: {
          monthlyRent: 25000,
          depositAsked: 125000,
          propertyType: 'residential',
          locality: 'Koramangala',
          leaseLength: 11,
          isRegistered: false,
          maintenanceCharge: 2000,
        },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(['Typical', 'High', 'Potentially excessive']).toContain(body.verdict);
      expect(body.documentChecklist).toBeDefined();
      expect(body.negotiatingPoints).toBeDefined();
      await app.close();
    });

    it('returns 400 for invalid input', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'POST',
        url: '/api/deposit-check',
        payload: { monthlyRent: 'not-a-number' },
      });
      expect(res.statusCode).toBe(400);
      await app.close();
    });
  });

  describe('POST /api/reviews', () => {
    it('returns 400 when freeText contains phone number (PII)', async () => {
      const app = await buildApp();
      const landlordId = uuidv4();
      await LandlordRepo.insert({
        id: landlordId,
        name: 'PII Test Landlord',
        localities: ['Koramangala'],
        avgRating: 0,
        reviewCount: 0,
        badges: [],
        isDemo: true,
        createdAt: new Date().toISOString(),
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/reviews',
        payload: {
          landlordId,
          locality: 'Koramangala',
          bhk: 2,
          rentPerMonth: 25000,
          tenancyStart: '2023-01-01',
          ratings: {
            maintenance: 3,
            depositReturn: 3,
            privacyRespect: 3,
            rentIncreaseFairness: 3,
            communication: 3,
          },
          depositAmount: 50000,
          depositReturned: 50000,
          freeText: 'Please call 9876543210 to verify this review. The landlord was okay overall.',
          anonymous: false,
          wouldRentAgain: true,
        },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('PII_DETECTED');
      await app.close();
    });

    it('accepts valid review and returns 201', async () => {
      const app = await buildApp();
      const landlordId = uuidv4();
      await LandlordRepo.insert({
        id: landlordId,
        name: 'Valid Test Landlord',
        localities: ['Indiranagar'],
        avgRating: 0,
        reviewCount: 0,
        badges: [],
        isDemo: true,
        createdAt: new Date().toISOString(),
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/reviews',
        payload: {
          landlordId,
          locality: 'Indiranagar',
          bhk: 2,
          rentPerMonth: 30000,
          tenancyStart: '2023-01-01',
          tenancyEnd: '2024-01-01',
          ratings: {
            maintenance: 4,
            depositReturn: 5,
            privacyRespect: 4,
            rentIncreaseFairness: 4,
            communication: 5,
          },
          depositAmount: 90000,
          depositReturned: 90000,
          freeText:
            'Very good landlord. Returned full deposit within 20 days. Maintenance requests were handled promptly. Would strongly recommend to anyone looking in Indiranagar.',
          anonymous: false,
          wouldRentAgain: true,
        },
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.success).toBe(true);
      expect(body.reviewId).toBeDefined();
      await app.close();
    });
  });

  describe('GET /api/rights', () => {
    it('returns rights articles list', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/rights' });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.data)).toBe(true);
      await app.close();
    });
  });

  describe('GET /api/localities', () => {
    it('returns localities list', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/localities' });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.data)).toBe(true);
      await app.close();
    });
  });
});
