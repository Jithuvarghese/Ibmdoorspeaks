import { describe, it, expect } from 'vitest';
import { containsPII, containsProfanity } from '../src/llm.js';

describe('containsPII', () => {
  it('detects 10-digit Indian mobile number', () => {
    expect(containsPII('call me on 9876543210 for details')).toBe(true);
  });

  it('detects Aadhaar-like 12-digit number', () => {
    expect(containsPII('my aadhaar is 1234 5678 9012')).toBe(true);
  });

  it('detects email address', () => {
    expect(containsPII('contact landlord@gmail.com for info')).toBe(true);
  });

  it('allows normal review text', () => {
    expect(
      containsPII(
        'Very good landlord. Returned deposit in 30 days. Maintenance was excellent. Would recommend.'
      )
    ).toBe(false);
  });
});

describe('containsProfanity', () => {
  it('detects profanity', () => {
    expect(containsProfanity('this fucking landlord is awful')).toBe(true);
  });

  it('allows normal text', () => {
    expect(containsProfanity('Landlord was quite rude but manageable')).toBe(false);
  });
});
