import { describe, it, expect } from 'vitest';
import { checkDeposit } from '../src/depositRules.js';

describe('checkDeposit', () => {
  it('returns Typical for a 3-month deposit in a standard-tier area (Electronic City)', () => {
    const result = checkDeposit({
      monthlyRent: 15000,
      depositAsked: 45000,
      propertyType: 'residential',
      locality: 'Electronic City',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 1000,
    });
    expect(result.depositMonths).toBeCloseTo(3);
    expect(result.verdict).toBe('Typical');
    expect(result.norm.min).toBe(2);
    expect(result.norm.max).toBe(6);
  });

  it('returns Potentially excessive for 12-month deposit in mid-tier area', () => {
    const result = checkDeposit({
      monthlyRent: 25000,
      depositAsked: 300000,
      propertyType: 'residential',
      locality: 'Koramangala',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 2000,
    });
    expect(result.verdict).toBe('Potentially excessive');
    expect(result.redFlags.length).toBeGreaterThan(0);
  });

  it('flags unregistered lease > 11 months', () => {
    const result = checkDeposit({
      monthlyRent: 20000,
      depositAsked: 80000,
      propertyType: 'residential',
      locality: 'Whitefield',
      leaseLength: 24,
      isRegistered: false,
      maintenanceCharge: 1500,
    });
    const hasLeaseFlag = result.redFlags.some((f) => f.includes('registered'));
    expect(hasLeaseFlag).toBe(true);
  });

  it('flags excessive maintenance charge', () => {
    const result = checkDeposit({
      monthlyRent: 20000,
      depositAsked: 60000,
      propertyType: 'residential',
      locality: 'Electronic City',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 5000, // > 15% of 20000
    });
    const hasMaintenanceFlag = result.redFlags.some((f) => f.includes('maintenance') || f.includes('Maintenance'));
    expect(hasMaintenanceFlag).toBe(true);
  });

  it('provides document checklist', () => {
    const result = checkDeposit({
      monthlyRent: 30000,
      depositAsked: 90000,
      propertyType: 'residential',
      locality: 'Indiranagar',
      leaseLength: 11,
      isRegistered: true,
      maintenanceCharge: 2000,
    });
    expect(result.documentChecklist.length).toBeGreaterThan(5);
  });

  it('handles unknown locality with mid-tier defaults', () => {
    const result = checkDeposit({
      monthlyRent: 20000,
      depositAsked: 60000,
      propertyType: 'residential',
      locality: 'Some Unknown Area',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 0,
    });
    expect(result.verdict).toBeDefined();
    expect(result.norm.min).toBe(4);
    expect(result.norm.max).toBe(10);
  });

  it('handles commercial property type', () => {
    const result = checkDeposit({
      monthlyRent: 50000,
      depositAsked: 400000,
      propertyType: 'commercial',
      locality: 'Koramangala',
      leaseLength: 11,
      isRegistered: false,
      maintenanceCharge: 0,
    });
    expect(result.depositMonths).toBeCloseTo(8);
    expect(result.verdict).toBe('Potentially excessive');
  });
});
