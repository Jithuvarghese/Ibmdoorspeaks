import type { DepositCheckRequest, DepositCheckResult } from '@doorspeaks/shared';

// ─── Locality tier configuration ─────────────────────────────────────────────
// Market norms only. NOT statutory caps. Source: broker surveys, NoBroker data.

export type LocalityTier = 'premium' | 'mid' | 'standard';

export const LOCALITY_TIERS: Record<string, LocalityTier> = {
  koramangala: 'premium',
  indiranagar: 'premium',
  'hsr layout': 'premium',
  whitefield: 'mid',
  marathahalli: 'mid',
  bellandur: 'mid',
  'electronic city': 'standard',
  'jp nagar': 'mid',
  jayanagar: 'mid',
  'btm layout': 'mid',
  hebbal: 'mid',
  yelahanka: 'standard',
  banashankari: 'mid',
  malleshwaram: 'premium',
  'mg road': 'premium',
  'brigade road': 'premium',
  'richmond town': 'premium',
  'sadashivanagar': 'premium',
  'cunningham road': 'premium',
  rajajinagar: 'mid',
  vijayanagar: 'mid',
  'rt nagar': 'standard',
  'hennur road': 'standard',
  'cv raman nagar': 'mid',
  'kr puram': 'standard',
  'bannerghatta road': 'mid',
  'sarjapur road': 'mid',
  'outer ring road': 'mid',
  bommanahalli: 'standard',
  'electronic city phase 2': 'standard',
};

export const DEPOSIT_NORMS: Record<
  LocalityTier,
  Record<'residential' | 'commercial', { min: number; max: number }>
> = {
  premium: {
    residential: { min: 6, max: 11 },
    commercial: { min: 3, max: 6 },
  },
  mid: {
    residential: { min: 4, max: 10 },
    commercial: { min: 3, max: 6 },
  },
  standard: {
    residential: { min: 2, max: 6 },
    commercial: { min: 2, max: 4 },
  },
};

export const DOCUMENT_CHECKLIST = [
  'Registered rent agreement (mandatory if rent > ₹3,500/month per Karnataka Rent Act)',
  'Landlord ID proof (Aadhaar / PAN / Passport)',
  'Property ownership document (sale deed / khata)',
  'Encumbrance certificate (confirms property is free of legal charges)',
  'Occupation Certificate (OC) / Completion Certificate (CC)',
  'Society NOC (if applicable)',
  'Police verification form (tenant obligation under BBMP rules)',
  'Inventory list with photos signed by both parties',
  'BESCOM electricity bill (verify tariff category — must be LT-2 Domestic for residential)',
  'BWSSB water bill (verify tariff)',
  'Maintenance charge breakdown from society',
];

export const LEGAL_CONTEXT =
  'Under the Karnataka Rent Act 1999, the Rent Control Authority regulates residential tenancies. ' +
  'The Act does not prescribe a statutory cap on the security deposit amount. ' +
  "However, market practice in Bangalore ranges from 2\u201310 months' rent for residential properties, " +
  'depending on the locality and the landlord. ' +
  'Deposits beyond 10 months are uncommon and may indicate exploitative intent. ' +
  'You have the right to demand a registered rent agreement; unregistered 11-month agreements ' +
  'are common but offer fewer protections. Source: Karnataka Rent Act 1999 (Act No. 22 of 2001).';

// ─── Core rule logic ──────────────────────────────────────────────────────────

export function checkDeposit(req: DepositCheckRequest): DepositCheckResult {
  const tierKey = req.locality.toLowerCase().trim();
  const tier: LocalityTier = LOCALITY_TIERS[tierKey] ?? 'mid';
  const norm = DEPOSIT_NORMS[tier][req.propertyType];

  const depositMonths = req.depositAsked / req.monthlyRent;
  const roundedMonths = Math.round(depositMonths * 10) / 10;

  let verdict: DepositCheckResult['verdict'];
  if (depositMonths > norm.max) {
    verdict = 'Potentially excessive';
  } else if (depositMonths > norm.min + 1) {
    verdict = 'High';
  } else {
    verdict = 'Typical';
  }

  const negotiatingPoints: string[] = [];
  const redFlags: string[] = [];

  if (depositMonths > norm.max) {
    negotiatingPoints.push(
      `Ask to cap deposit at ${norm.max} months (₹${(req.monthlyRent * norm.max).toLocaleString('en-IN')}), which is the market maximum for ${tier} localities in Bangalore.`
    );
    redFlags.push(`Deposit of ${roundedMonths.toFixed(1)} months exceeds the typical market maximum of ${norm.max} months for ${req.propertyType} in ${tier}-tier Bangalore areas.`);
  } else if (depositMonths > norm.min) {
    negotiatingPoints.push(
      `Typical deposits in this area start from ${norm.min} months. Try negotiating to ${norm.min}–${norm.min + 1} months.`
    );
  }

  if (!req.isRegistered && req.leaseLength > 11) {
    redFlags.push(
      'Lease duration exceeds 11 months but agreement may not be registered. Unregistered leases for >11 months are not legally enforceable in Karnataka.'
    );
    negotiatingPoints.push(
      'Insist on a registered lease agreement. Registration cost is minimal (0.1% stamp duty + ₹500–1,000 registration fee).'
    );
  }

  if (!req.isRegistered) {
    negotiatingPoints.push(
      'Request a registered rent agreement for stronger legal protection, even for 11-month leases.'
    );
  }

  if (req.maintenanceCharge > req.monthlyRent * 0.15) {
    redFlags.push(
      `Maintenance charge (₹${req.maintenanceCharge.toLocaleString('en-IN')}) is unusually high — more than 15% of rent. Demand a breakdown from the society.`
    );
  }

  negotiatingPoints.push(
    'Get a written receipt for the deposit with a clear clause specifying the conditions and timeline for refund (usually 1–2 months after vacating, subject to deductions for actual damages only).',
    'Conduct a joint move-in inspection and document the property condition with photographs signed by the landlord.'
  );

  const explanation =
    `Your deposit of ₹${req.depositAsked.toLocaleString('en-IN')} is equivalent to ` +
    `${roundedMonths.toFixed(1)} months' rent. ` +
    `For ${req.propertyType} properties in a ${tier}-tier Bangalore locality, ` +
    `the typical market range is ${norm.min}–${norm.max} months. ` +
    `This deposit is ${verdict === 'Typical' ? 'within the typical market range' : verdict === 'High' ? 'at the higher end of the market range' : 'above the typical market range'}.`;

  return {
    verdict,
    depositMonths: roundedMonths,
    norm,
    explanation,
    legalContext: LEGAL_CONTEXT,
    negotiatingPoints,
    redFlags,
    documentChecklist: DOCUMENT_CHECKLIST,
  };
}

// ─── Rent fairness ────────────────────────────────────────────────────────────

export function FURNISHING_MULTIPLIER(furnishing: string): number {
  if (furnishing === 'fully-furnished') return 1.25;
  if (furnishing === 'semi-furnished') return 1.1;
  return 1.0;
}
