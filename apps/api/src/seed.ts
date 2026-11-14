import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db.js';
import { LandlordRepo, PropertyRepo, ReviewRepo, LocalityRepo, RightsRepo } from './repository.js';
import type { Locality, RightsArticle, Review, Landlord, Property } from '@doorspeaks/shared';

process.env['DATABASE_PATH'] = process.env['DATABASE_PATH'] ?? './data/doorspeaks.json';

async function seed() {
  console.log('🌱 Seeding DoorSpeaks demo data...');

  // Ensure DB is initialized
  await getDb();

  // ─── Localities ───────────────────────────────────────────────────────────────

  const LOCALITIES: Locality[] = [
    {
      id: uuidv4(), slug: 'koramangala', name: 'Koramangala', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 18000, max: 32000 },
        { bhk: 2, min: 32000, max: 60000 },
        { bhk: 3, min: 55000, max: 100000 },
      ],
      typicalDepositMonths: { min: 6, max: 11 },
      metroLine: 'Green Line (proposed)', metroStation: 'Koramangala (Phase 3)',
      lat: 12.9352, lng: 77.6245,
      description: 'Premier startup hub in south Bangalore. Home to restaurants, tech offices, and vibrant nightlife. High demand drives premium rents. 6–10 months deposit typical.',
      rentTrend: generateTrend(28000, 12),
    },
    {
      id: uuidv4(), slug: 'indiranagar', name: 'Indiranagar', zone: 'East',
      rentRanges: [
        { bhk: 1, min: 20000, max: 35000 },
        { bhk: 2, min: 35000, max: 65000 },
        { bhk: 3, min: 60000, max: 110000 },
      ],
      typicalDepositMonths: { min: 6, max: 10 },
      metroLine: 'Purple Line', metroStation: 'Indiranagar',
      lat: 12.9784, lng: 77.6408,
      description: 'Upscale locality with Metro connectivity, restaurants, and nightlife. Very high demand from IT professionals. Deposits at 8–10 months are common.',
      rentTrend: generateTrend(32000, 12),
    },
    {
      id: uuidv4(), slug: 'hsr-layout', name: 'HSR Layout', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 16000, max: 28000 },
        { bhk: 2, min: 28000, max: 52000 },
        { bhk: 3, min: 48000, max: 85000 },
      ],
      typicalDepositMonths: { min: 6, max: 10 },
      metroLine: 'Green Line (proposed)', metroStation: 'HSR Layout (Phase 3)',
      lat: 12.9116, lng: 77.6389,
      description: 'Planned layout with wide roads, parks, and excellent social infrastructure. Popular with startup founders and IT workers. Close to Koramangala and Bellandur.',
      rentTrend: generateTrend(24000, 12),
    },
    {
      id: uuidv4(), slug: 'whitefield', name: 'Whitefield', zone: 'East',
      rentRanges: [
        { bhk: 1, min: 14000, max: 25000 },
        { bhk: 2, min: 24000, max: 45000 },
        { bhk: 3, min: 40000, max: 72000 },
      ],
      typicalDepositMonths: { min: 5, max: 10 },
      metroLine: 'Purple Line', metroStation: 'Whitefield / ITPL',
      lat: 12.9698, lng: 77.7500,
      description: 'Major IT hub with ITPL and large tech campuses. Metro extended to Whitefield in 2023. Longer commute to central Bangalore but good local amenities.',
      rentTrend: generateTrend(20000, 12),
    },
    {
      id: uuidv4(), slug: 'marathahalli', name: 'Marathahalli', zone: 'East',
      rentRanges: [
        { bhk: 1, min: 13000, max: 22000 },
        { bhk: 2, min: 22000, max: 40000 },
        { bhk: 3, min: 36000, max: 60000 },
      ],
      typicalDepositMonths: { min: 4, max: 8 },
      metroLine: 'Blue Line (proposed)', metroStation: 'Marathahalli (Phase 2B)',
      lat: 12.9591, lng: 77.6974,
      description: 'High-density residential area near Outer Ring Road. Popular with Whitefield/Bellandur IT professionals. Good eateries and shopping.',
      rentTrend: generateTrend(18000, 12),
    },
    {
      id: uuidv4(), slug: 'bellandur', name: 'Bellandur', zone: 'South East',
      rentRanges: [
        { bhk: 1, min: 14000, max: 24000 },
        { bhk: 2, min: 24000, max: 44000 },
        { bhk: 3, min: 38000, max: 65000 },
      ],
      typicalDepositMonths: { min: 4, max: 8 },
      lat: 12.9257, lng: 77.6763,
      description: 'Rapidly developing area near Outer Ring Road and Sarjapur Road. Many gated communities. The lake area has had water quality issues — check proximity when renting.',
      rentTrend: generateTrend(19000, 12),
    },
    {
      id: uuidv4(), slug: 'electronic-city', name: 'Electronic City', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 10000, max: 18000 },
        { bhk: 2, min: 16000, max: 30000 },
        { bhk: 3, min: 26000, max: 45000 },
      ],
      typicalDepositMonths: { min: 2, max: 6 },
      metroLine: 'Green Line', metroStation: 'Electronic City',
      lat: 12.8399, lng: 77.6770,
      description: 'Major IT hub (Infosys, Wipro campuses). Metro connectivity via elevated corridor. More affordable than central areas. 2–5 months deposit typical.',
      rentTrend: generateTrend(14000, 12),
    },
    {
      id: uuidv4(), slug: 'jp-nagar', name: 'JP Nagar', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 14000, max: 24000 },
        { bhk: 2, min: 24000, max: 42000 },
        { bhk: 3, min: 38000, max: 65000 },
      ],
      typicalDepositMonths: { min: 4, max: 8 },
      metroLine: 'Green Line', metroStation: 'JP Nagar',
      lat: 12.9077, lng: 77.5856,
      description: 'Large, well-planned residential area in south Bangalore. Good Metro connectivity, BDA parks, and markets. Family-friendly with quieter roads.',
      rentTrend: generateTrend(19000, 12),
    },
    {
      id: uuidv4(), slug: 'jayanagar', name: 'Jayanagar', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 16000, max: 28000 },
        { bhk: 2, min: 28000, max: 50000 },
        { bhk: 3, min: 45000, max: 80000 },
      ],
      typicalDepositMonths: { min: 6, max: 10 },
      metroLine: 'Green Line', metroStation: 'Jayanagar',
      lat: 12.9250, lng: 77.5938,
      description: "One of Bangalore's oldest planned localities. Well-connected via Metro. Popular with Kannadiga families. High demand drives 6–10 month deposits.",
      rentTrend: generateTrend(22000, 12),
    },
    {
      id: uuidv4(), slug: 'btm-layout', name: 'BTM Layout', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 14000, max: 25000 },
        { bhk: 2, min: 25000, max: 44000 },
        { bhk: 3, min: 40000, max: 68000 },
      ],
      typicalDepositMonths: { min: 5, max: 9 },
      lat: 12.9166, lng: 77.6101,
      description: 'Busy residential area between Jayanagar and Koramangala. Good restaurants and local transport. Popular with young professionals and IT workers.',
      rentTrend: generateTrend(20000, 12),
    },
    {
      id: uuidv4(), slug: 'hebbal', name: 'Hebbal', zone: 'North',
      rentRanges: [
        { bhk: 1, min: 15000, max: 26000 },
        { bhk: 2, min: 26000, max: 48000 },
        { bhk: 3, min: 42000, max: 75000 },
      ],
      typicalDepositMonths: { min: 5, max: 9 },
      metroLine: 'Red Line', metroStation: 'Hebbal',
      lat: 13.0352, lng: 77.5970,
      description: 'North Bangalore hub with proximity to airport. Good Metro access. Embassy and IT office zones nearby. Flyover area prone to traffic during peak hours.',
      rentTrend: generateTrend(21000, 12),
    },
    {
      id: uuidv4(), slug: 'yelahanka', name: 'Yelahanka', zone: 'North',
      rentRanges: [
        { bhk: 1, min: 10000, max: 18000 },
        { bhk: 2, min: 16000, max: 30000 },
        { bhk: 3, min: 26000, max: 46000 },
      ],
      typicalDepositMonths: { min: 2, max: 5 },
      lat: 13.1007, lng: 77.5963,
      description: 'Large township in north Bangalore. More affordable, quieter. Good for families. IAF station area. Some parts still developing. Close to airport.',
      rentTrend: generateTrend(13000, 12),
    },
    {
      id: uuidv4(), slug: 'banashankari', name: 'Banashankari', zone: 'South',
      rentRanges: [
        { bhk: 1, min: 13000, max: 22000 },
        { bhk: 2, min: 22000, max: 40000 },
        { bhk: 3, min: 36000, max: 62000 },
      ],
      typicalDepositMonths: { min: 4, max: 8 },
      metroLine: 'Green Line', metroStation: 'Banashankari',
      lat: 12.9255, lng: 77.5468,
      description: 'Established residential locality with Metro access. Known for temples and peaceful environment. Good BMTC connectivity.',
      rentTrend: generateTrend(18000, 12),
    },
    {
      id: uuidv4(), slug: 'malleshwaram', name: 'Malleshwaram', zone: 'West',
      rentRanges: [
        { bhk: 1, min: 16000, max: 30000 },
        { bhk: 2, min: 30000, max: 55000 },
        { bhk: 3, min: 50000, max: 90000 },
      ],
      typicalDepositMonths: { min: 6, max: 11 },
      metroLine: 'Purple Line', metroStation: 'Malleshwaram',
      lat: 12.9980, lng: 77.5660,
      description: 'Heritage locality in northwest Bangalore. Cultural hub with Rajajinagar market, temples, old Bangalore charm. High demand from established families.',
      rentTrend: generateTrend(24000, 12),
    },
    {
      id: uuidv4(), slug: 'sarjapur-road', name: 'Sarjapur Road', zone: 'South East',
      rentRanges: [
        { bhk: 1, min: 13000, max: 23000 },
        { bhk: 2, min: 22000, max: 42000 },
        { bhk: 3, min: 36000, max: 62000 },
      ],
      typicalDepositMonths: { min: 4, max: 9 },
      lat: 12.9075, lng: 77.6825,
      description: 'Fast-developing corridor with many IT parks and gated communities. Good for families. Traffic can be heavy during peak hours.',
      rentTrend: generateTrend(18000, 12),
    },
  ];

  function generateTrend(baseRent: number, months: number): { month: string; avgRent: number }[] {
    const trend = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toISOString().slice(0, 7);
      const variation = 1 + (Math.random() * 0.08 - 0.02);
      trend.push({ month, avgRent: Math.round(baseRent * variation) });
    }
    return trend;
  }

  for (const loc of LOCALITIES) {
    await LocalityRepo.insert(loc);
  }
  console.log(`✅ Inserted ${LOCALITIES.length} localities`);

  // ─── Rights Articles ──────────────────────────────────────────────────────────

  const ARTICLES: RightsArticle[] = [
    {
      id: uuidv4(),
      slug: 'security-deposit-return',
      title: 'Security Deposit: Your Right to Get It Back',
      category: 'Deposits',
      excerpt: 'Your landlord must return your security deposit after you vacate. Learn the timelines, deductions they can and cannot make, and what to do if they refuse.',
      needsLawyerVerification: false,
      officialLinks: [
        'https://www.karnataka.gov.in/pages/rentact',
        'https://indiacode.nic.in/handle/123456789/4475',
      ],
      content: `# Security Deposit: Your Right to Get It Back

**⚠️ Not legal advice. Consult a qualified advocate for your specific situation.**

## What is a Security Deposit?

A security deposit (also called "advance" in Bangalore) is money you pay your landlord before moving in, to be refunded when you move out. In Bangalore, this is typically 2–10 months' rent depending on the locality.

## Timeline for Return

The Karnataka Rent Act 1999 does not specify an exact number of days for deposit return. However, courts have consistently held that deposit should be returned within 1–2 months of vacating. Any deductions must be communicated in writing with itemized bills.

## What Can Be Deducted?

✅ Landlord CAN deduct for actual physical damage, unpaid rent, unpaid utility bills.
❌ Landlord CANNOT deduct for normal wear and tear, routine maintenance, repainting (unless walls are genuinely damaged).

## Steps to Recover Your Deposit

1. Send a formal demand letter citing the move-out date
2. Keep records: move-in/out photos, rent receipts, utility bills  
3. File a complaint with the Rent Control Authority / Rent Court if landlord refuses
4. For amounts above ₹2 lakh, engage an advocate`,
    },
    {
      id: uuidv4(),
      slug: 'rent-increase-rules',
      title: 'Rent Increase Rules in Karnataka',
      category: 'Rent',
      excerpt: 'Your landlord cannot increase rent unilaterally during a lease term. Know the rules, typical annual increase norms, and your rights to dispute an unfair hike.',
      needsLawyerVerification: false,
      officialLinks: ['https://www.karnataka.gov.in/pages/rentact'],
      content: `# Rent Increase Rules in Karnataka

**⚠️ Not legal advice. Consult a qualified advocate for your specific situation.**

Your landlord cannot increase rent during the fixed term of your lease. At renewal, typical annual increase in Bangalore is 5–10%. Above 20% per year is unusual and potentially exploitative.

## Karnataka Rent Act 1999 Applicability

The Act applies to residential premises where monthly rent does not exceed ₹3,500. Most Bangalore rentals exceed this threshold.`,
    },
    {
      id: uuidv4(),
      slug: 'eviction-notice-periods',
      title: 'Eviction Notice Periods and Your Protection',
      category: 'Eviction',
      excerpt: 'Your landlord must give you proper notice before asking you to vacate. Know the minimum notice periods, grounds for eviction, and what constitutes illegal eviction.',
      needsLawyerVerification: true,
      officialLinks: ['https://www.karnataka.gov.in/pages/rentact'],
      content: `# Eviction Notice Periods and Your Protection

**⚠️ Not legal advice. 🔖 Lawyer verification recommended.**

Minimum notice periods: Month-to-month tenancy (1 month), Fixed-term lease (per agreement), Non-payment (15 days demand).

Illegal eviction tactics include cutting electricity/water, changing locks, removing belongings. Call police if this happens.`,
    },
    {
      id: uuidv4(),
      slug: 'landlord-entry-privacy',
      title: 'Landlord Entry and Your Right to Privacy',
      category: 'Privacy',
      excerpt: 'Your rented home is your private space. Your landlord cannot enter without prior notice. Learn your privacy rights and how to assert them.',
      needsLawyerVerification: false,
      officialLinks: [],
      content: `# Landlord Entry and Your Right to Privacy

**⚠️ Not legal advice.**

Your landlord must give at least 24 hours advance notice before entry. Entry is only for agreed purposes (repairs, inspection). The exception is genuine emergencies (gas leak, fire, flooding).

Insist on lease clause: "Landlord shall provide at least 24 hours prior written notice before entering except in genuine emergencies."`,
    },
    {
      id: uuidv4(),
      slug: 'rent-agreement-registration',
      title: 'Rent Agreements: 11-Month vs Registered Leases',
      category: 'Agreements',
      excerpt: 'Why do most leases in Bangalore say "11 months"? What is the difference between registered and unregistered agreements? Which gives you better protection?',
      needsLawyerVerification: false,
      officialLinks: [
        'https://kaverionline.karnataka.gov.in',
        'https://stamps.karnataka.gov.in',
      ],
      content: `# Rent Agreements: 11-Month vs Registered Leases

**⚠️ Not legal advice.**

Leases for 12+ months must be registered under Registration Act 1908. 11-month leases avoid this requirement. Registered leases offer stronger legal protection. For long tenancies, insist on registration.

Kaveri Online Services for registration: https://kaverionline.karnataka.gov.in`,
    },
    {
      id: uuidv4(),
      slug: 'police-verification',
      title: 'Police Verification for Tenants',
      category: 'Documentation',
      excerpt: 'Police verification is a legal requirement for tenants in Karnataka. Learn the process, your obligations, and what happens if it is not done.',
      needsLawyerVerification: false,
      officialLinks: ['https://ksp.karnataka.gov.in'],
      content: `# Police Verification for Tenants

**⚠️ Not legal advice.**

Tenants must complete police verification within 30 days of moving in. Online at: https://ksp.karnataka.gov.in

Documents required: Aadhaar, PAN card, rent agreement copy, landlord's ID and property documents, passport-size photographs.`,
    },
    {
      id: uuidv4(),
      slug: 'maintenance-society-charges',
      title: 'Maintenance and Society Charges: What You Must Pay',
      category: 'Maintenance',
      excerpt: 'Who pays for maintenance — tenant or landlord? What are society charges, and when are they excessive? Know your rights and obligations.',
      needsLawyerVerification: false,
      officialLinks: ['https://bbmp.gov.in'],
      content: `# Maintenance and Society Charges

**⚠️ Not legal advice.**

Landlords may pass society maintenance to tenants if disclosed in the agreement. Maintenance charges above 15% of monthly rent without clear breakdown are a red flag. Structural repairs are always the landlord's responsibility.`,
    },
    {
      id: uuidv4(),
      slug: 'electricity-water-billing',
      title: 'Electricity and Water Billing: Tenant Rights',
      category: 'Utilities',
      excerpt: 'Your landlord cannot charge commercial electricity tariffs on a residential connection. Know how BESCOM and BWSSB billing works.',
      needsLawyerVerification: false,
      officialLinks: ['https://bescom.org', 'https://bwssb.gov.in'],
      content: `# Electricity and Water Billing: Tenant Rights

**⚠️ Not legal advice.**

Landlord CANNOT charge commercial (LT-5) BESCOM tariff on a domestic connection. You have the right to see the original BESCOM bill with connection category. BESCOM toll-free: 1912. BWSSB toll-free: 1916.`,
    },
    {
      id: uuidv4(),
      slug: 'rent-court-process',
      title: 'Rent Court and Rent Control Authority: How to File',
      category: 'Legal Process',
      excerpt: 'If your landlord refuses to return your deposit, files wrongful eviction, or violates your lease, you can approach the Rent Court.',
      needsLawyerVerification: true,
      officialLinks: [
        'https://districts.ecourts.gov.in/bangalore',
        'https://hckinfo.karnataka.gov.in',
      ],
      content: `# Rent Court and Rent Control Authority

**⚠️ Not legal advice. 🔖 Lawyer verification recommended.**

Send a legal notice first (registered post with acknowledgment due). Then file at the City Civil Court. Lok Adalat is faster for amounts below ₹1 lakh.

Online filing: https://efiling.ecourts.gov.in`,
    },
    {
      id: uuidv4(),
      slug: 'how-to-send-legal-notice',
      title: 'How to Send a Legal Notice to Your Landlord',
      category: 'Legal Process',
      excerpt: 'A formal legal notice can resolve many landlord disputes without going to court. Learn what to include, how to send it, and what to expect.',
      needsLawyerVerification: false,
      officialLinks: [],
      content: `# How to Send a Legal Notice to Your Landlord

**⚠️ Not legal advice.**

Send by registered post with acknowledgment due (RPAD). Include: your name and address, landlord's name and address, property address, nature of dispute, amounts involved, demand and deadline (15–30 days), consequence if not complied.

Use DoorSpeaks Deposit Letter Generator for a ready-to-use template.`,
    },
    {
      id: uuidv4(),
      slug: 'move-in-move-out-checklist',
      title: 'Move-In / Move-Out Inspection Checklist',
      category: 'Documentation',
      excerpt: 'Protect your deposit by documenting the property condition at move-in and move-out. Use this checklist to record every room and fixture.',
      needsLawyerVerification: false,
      officialLinks: [],
      content: `# Move-In / Move-Out Inspection Checklist

**⚠️ Not legal advice.**

Document everything: walls, ceiling, flooring, doors, windows, appliances. Photograph all defects before moving in. Have the landlord sign the checklist. At move-out, repeat and compare with move-in photos.

Use DoorSpeaks Checklist App for a digital version.`,
    },
    {
      id: uuidv4(),
      slug: 'stamp-duty-basics',
      title: 'Stamp Duty for Rent Agreements in Karnataka',
      category: 'Agreements',
      excerpt: 'Understand stamp duty on rent agreements in Karnataka. What must be stamped? How much does it cost? Can an unstamped agreement be used in court?',
      needsLawyerVerification: false,
      officialLinks: [
        'https://stamps.karnataka.gov.in',
        'https://kaverionline.karnataka.gov.in',
      ],
      content: `# Stamp Duty for Rent Agreements in Karnataka

**⚠️ Not legal advice.**

Stamp duty: 0.1% of total rent + deposit for leases up to 1 year. For ₹25,000/month, 11-month lease with ₹2L deposit: approximately ₹475 stamp duty.

e-Stamping via Kaveri Online Services: https://kaverionline.karnataka.gov.in

Unstamped agreements are not admissible in court until stamp duty + 10x penalty is paid.`,
    },
  ];

  for (const article of ARTICLES) {
    await RightsRepo.insert(article);
  }
  console.log(`✅ Inserted ${ARTICLES.length} rights articles`);

  // ─── Landlords ────────────────────────────────────────────────────────────────

  const LANDLORD_DATA = [
    { name: 'Ramesh Sharma', localities: ['Koramangala', 'BTM Layout'] },
    { name: 'Suresh Nair', localities: ['Indiranagar', 'Whitefield'] },
    { name: 'Priya Reddy', localities: ['HSR Layout', 'Bellandur'] },
    { name: 'Venkat Rao', localities: ['Electronic City', 'Sarjapur Road'] },
    { name: 'Anand Kumar', localities: ['Koramangala'] },
    { name: 'Meena Krishnan', localities: ['Jayanagar', 'JP Nagar'] },
    { name: 'Rajesh Patel', localities: ['Whitefield', 'Marathahalli'] },
    { name: 'Deepa Murthy', localities: ['Malleshwaram', 'Rajajinagar'] },
    { name: 'Srinivas Hegde', localities: ['Hebbal', 'Yelahanka'] },
    { name: 'Kavitha Gowda', localities: ['Banashankari', 'BTM Layout'] },
    { name: 'Arun Menon', localities: ['Indiranagar', 'Koramangala'] },
    { name: 'Lakshmi Iyer', localities: ['JP Nagar', 'Banashankari'] },
    { name: 'Mahesh Shetty', localities: ['Whitefield'] },
    { name: 'Rekha Joshi', localities: ['HSR Layout'] },
    { name: 'Girish Bhat', localities: ['Electronic City', 'BTM Layout'] },
    { name: 'Pavitra Deshpande', localities: ['Bellandur', 'Sarjapur Road'] },
    { name: 'Narayan Swamy', localities: ['Koramangala', 'Jayanagar'] },
    { name: 'Usha Pillai', localities: ['Marathahalli', 'Whitefield'] },
    { name: 'Kiran Setty', localities: ['Hebbal'] },
    { name: 'Bharathi Rajan', localities: ['Malleshwaram'] },
    { name: 'Dinesh Kulkarni', localities: ['BTM Layout', 'Koramangala'] },
    { name: 'Manjunath K', localities: ['Yelahanka', 'Hebbal'] },
    { name: 'Savitha Rao', localities: ['Jayanagar'] },
    { name: 'Prakash Nayak', localities: ['Sarjapur Road', 'Bellandur'] },
    { name: 'Vidya Sharma', localities: ['Indiranagar'] },
  ];

  const landlords: Landlord[] = LANDLORD_DATA.map((d) => ({
    id: uuidv4(),
    name: d.name,
    localities: d.localities,
    avgRating: 0,
    reviewCount: 0,
    badges: [],
    isDemo: true,
    createdAt: randomPastDate(365).toISOString(),
  }));

  for (const l of landlords) {
    await LandlordRepo.insert(l);
  }
  console.log(`✅ Inserted ${landlords.length} landlords`);

  // ─── Properties ───────────────────────────────────────────────────────────────

  const LOCALITY_LATLNG: Record<string, [number, number]> = {
    Koramangala: [12.9352, 77.6245],
    Indiranagar: [12.9784, 77.6408],
    'HSR Layout': [12.9116, 77.6389],
    Whitefield: [12.9698, 77.75],
    Marathahalli: [12.9591, 77.6974],
    Bellandur: [12.9257, 77.6763],
    'Electronic City': [12.8399, 77.677],
    'JP Nagar': [12.9077, 77.5856],
    Jayanagar: [12.925, 77.5938],
    'BTM Layout': [12.9166, 77.6101],
    Hebbal: [13.0352, 77.597],
    Yelahanka: [13.1007, 77.5963],
    Banashankari: [12.9255, 77.5468],
    Malleshwaram: [12.998, 77.566],
    'Sarjapur Road': [12.9075, 77.6825],
    Rajajinagar: [12.9931, 77.552],
  };

  const properties: Property[] = landlords.flatMap((l) =>
    l.localities.map((loc) => ({
      id: uuidv4(),
      landlordId: l.id,
      locality: loc,
      bhk: randomInt(1, 3),
      address: `Approx. ${loc} area, Bangalore (exact address withheld for privacy)`,
      lat: LOCALITY_LATLNG[loc]?.[0],
      lng: LOCALITY_LATLNG[loc]?.[1],
    }))
  );

  for (const p of properties) {
    await PropertyRepo.insert(p);
  }
  console.log(`✅ Inserted ${properties.length} properties`);

  // ─── Reviews ──────────────────────────────────────────────────────────────────

  const SAMPLE_REVIEWS_POSITIVE = [
    'Very cooperative landlord. Returned full deposit within 20 days of moving out. Always responded promptly to maintenance requests. Would highly recommend.',
    'Maintained the apartment well. No issues with privacy — always called before visiting. Rent increase at renewal was a reasonable 8%. Genuinely one of the better landlords in Bangalore.',
    'Professional and transparent. Gave us a registered rent agreement. Itemized all deductions from deposit. Would rent again without hesitation.',
    'Responsive to WhatsApp messages. Fixed the leaking tap within 2 days. Did not demand excessive deposit — only 3 months. Happy with the experience.',
    'Great landlord experience. No unexpected charges. Respected our privacy completely. Electric bill was at BESCOM domestic rates as it should be.',
    'Returned deposit in full after 30 days. Provided detailed move-out inspection. Fair and honest throughout the 2-year tenancy.',
    'Landlord was always professional. Never entered without calling ahead. Maintenance handled through the society, no delays. Very transparent about charges.',
  ];

  const SAMPLE_REVIEWS_NEGATIVE = [
    'Did not return deposit for 4 months. Had to send a legal notice before they paid. Deducted for "repainting" which was normal wear and tear after 3 years. Very frustrating experience.',
    'Changed locks when we complained about the missing hot water. Had to call police. Eventually moved out early. Would strongly advise against this landlord.',
    'No proper rent agreement — just a WhatsApp message. When we vacated, demanded we pay for damages that existed before our tenancy. Avoid.',
    'Charged commercial BESCOM rates on a domestic connection. When we asked for original bills, refused to show. Added extra charges every month.',
    'Very intrusive. Came to the flat twice without calling. When we raised this, became hostile. Tried to increase rent mid-lease. Refused.',
    'Deposit of 10 months was already steep. After moving out, refused to return anything citing mysterious "damages". The property was in better condition when we left.',
    'Communication was terrible. Maintenance requests ignored for weeks. AC broke in May and was not fixed for 6 weeks. Came to show flat to prospective tenants without informing us.',
  ];

  const SAMPLE_REVIEWS_NEUTRAL = [
    'Okay experience overall. Deposit was high (8 months) but returned after 45 days with minor deductions. Maintenance could have been better. Not the worst landlord in Bangalore.',
    'Standard experience. Rent increased 10% at renewal. Some delays in fixing the geyser but eventually sorted. No major complaints.',
    'Communication was decent. Deposit return took 2.5 months which is longer than ideal. No major deductions. Property was average quality.',
  ];

  function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)] as T;
  }

  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomPastDate(daysBack: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
    return d;
  }

  function randomRating(bias: 'good' | 'bad' | 'neutral'): number {
    if (bias === 'good') return randomInt(3, 5);
    if (bias === 'bad') return randomInt(1, 3);
    return randomInt(2, 4);
  }

  const reviews: Review[] = [];
  for (const landlord of landlords) {
    const numReviews = randomInt(1, 5);
    for (let i = 0; i < numReviews; i++) {
      const bias = Math.random() > 0.4 ? 'good' : Math.random() > 0.5 ? 'bad' : 'neutral';
      const locality = randomFromArray(landlord.localities);
      const rentPerMonth = randomInt(12000, 55000);
      const depositMonths = randomInt(2, 10);
      const depositAmount = rentPerMonth * depositMonths;
      const depositReturned = bias === 'good' ? depositAmount : bias === 'bad' ? Math.floor(depositAmount * 0.3) : Math.floor(depositAmount * 0.75);

      const startDate = randomPastDate(1000);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + randomInt(6, 24));

      const freeText = bias === 'good'
        ? randomFromArray(SAMPLE_REVIEWS_POSITIVE)
        : bias === 'bad'
        ? randomFromArray(SAMPLE_REVIEWS_NEGATIVE)
        : randomFromArray(SAMPLE_REVIEWS_NEUTRAL);

      reviews.push({
        id: uuidv4(),
        landlordId: landlord.id,
        locality,
        bhk: randomInt(1, 3),
        rentPerMonth,
        tenancyStart: startDate.toISOString().slice(0, 10),
        tenancyEnd: endDate < new Date() ? endDate.toISOString().slice(0, 10) : undefined,
        ratings: {
          maintenance: randomRating(bias),
          depositReturn: bias === 'good' ? randomInt(4, 5) : bias === 'bad' ? randomInt(1, 2) : randomInt(2, 4),
          privacyRespect: randomRating(bias),
          rentIncreaseFairness: randomRating(bias),
          communication: randomRating(bias),
        },
        depositAmount,
        depositReturned,
        freeText,
        anonymous: Math.random() > 0.5,
        wouldRentAgain: bias === 'good',
        moderationStatus: 'approved',
        isDemo: true,
        createdAt: randomPastDate(500).toISOString(),
      });
    }
  }

  for (const r of reviews) {
    await ReviewRepo.insert(r);
  }
  console.log(`✅ Inserted ${reviews.length} reviews`);

  // Recompute landlord stats
  for (const landlord of landlords) {
    await LandlordRepo.updateStats(landlord.id);
  }
  console.log('✅ Updated landlord stats and badges');

  console.log('\n🎉 Seed complete!');
  console.log(`   ${LOCALITIES.length} localities`);
  console.log(`   ${ARTICLES.length} rights articles`);
  console.log(`   ${landlords.length} landlords`);
  console.log(`   ${properties.length} properties`);
  console.log(`   ${reviews.length} reviews (all marked as DEMO DATA)\n`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
