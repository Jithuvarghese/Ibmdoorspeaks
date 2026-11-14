import { describe, it, expect } from 'vitest';
import { ReviewSubmitSchema, DepositCheckRequestSchema, ChatRequestSchema } from './index.js';

describe('ReviewSubmitSchema', () => {
  it('requires either landlordId or newLandlordName', () => {
    const result = ReviewSubmitSchema.safeParse({
      locality: 'Koramangala',
      bhk: 2,
      rentPerMonth: 25000,
      tenancyStart: '2023-01-01',
      ratings: { maintenance: 3, depositReturn: 3, privacyRespect: 3, rentIncreaseFairness: 3, communication: 3 },
      depositAmount: 50000,
      depositReturned: 50000,
      freeText: 'A'.repeat(60),
      anonymous: false,
      wouldRentAgain: true,
    });
    expect(result.success).toBe(false);
  });

  it('passes with newLandlordName', () => {
    const result = ReviewSubmitSchema.safeParse({
      newLandlordName: 'Test Landlord',
      locality: 'Koramangala',
      bhk: 2,
      rentPerMonth: 25000,
      tenancyStart: '2023-01-01',
      ratings: { maintenance: 4, depositReturn: 4, privacyRespect: 4, rentIncreaseFairness: 4, communication: 4 },
      depositAmount: 50000,
      depositReturned: 50000,
      freeText: 'Very good landlord. Returned full deposit on time and was very responsive.'.padEnd(60, ' '),
      anonymous: false,
      wouldRentAgain: true,
    });
    expect(result.success).toBe(true);
  });
});

describe('DepositCheckRequestSchema', () => {
  it('validates valid input', () => {
    const result = DepositCheckRequestSchema.safeParse({
      monthlyRent: 25000,
      depositAsked: 125000,
      propertyType: 'residential',
      locality: 'Koramangala',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 2000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid propertyType', () => {
    const result = DepositCheckRequestSchema.safeParse({
      monthlyRent: 25000,
      depositAsked: 125000,
      propertyType: 'industrial',
      locality: 'Koramangala',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 2000,
    });
    expect(result.success).toBe(false);
  });
});

describe('ChatRequestSchema', () => {
  it('requires at least one message', () => {
    const result = ChatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it('passes with valid messages', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'Hello' }],
    });
    expect(result.success).toBe(true);
  });
});
