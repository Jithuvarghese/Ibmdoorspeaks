import { z } from 'zod';

// ─── Landlord ────────────────────────────────────────────────────────────────

export const LandlordSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  localities: z.array(z.string()),
  avgRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  badges: z.array(z.string()),
  isDemo: z.boolean().default(false),
  createdAt: z.string(),
});

export type Landlord = z.infer<typeof LandlordSchema>;

// ─── Property ─────────────────────────────────────────────────────────────────

export const PropertySchema = z.object({
  id: z.string(),
  landlordId: z.string(),
  locality: z.string(),
  bhk: z.number().int().min(1).max(6),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Property = z.infer<typeof PropertySchema>;

// ─── Review ───────────────────────────────────────────────────────────────────

export const RatingsSchema = z.object({
  maintenance: z.number().int().min(1).max(5),
  depositReturn: z.number().int().min(1).max(5),
  privacyRespect: z.number().int().min(1).max(5),
  rentIncreaseFairness: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
});

export type Ratings = z.infer<typeof RatingsSchema>;

export const ReviewSubmitSchema = z.object({
  landlordId: z.string().optional(),
  newLandlordName: z.string().min(2).max(100).optional(),
  locality: z.string().min(2).max(100),
  bhk: z.number().int().min(1).max(6),
  rentPerMonth: z.number().int().min(1000).max(5000000),
  tenancyStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tenancyEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ratings: RatingsSchema,
  depositAmount: z.number().int().min(0),
  depositReturned: z.number().int().min(0),
  freeText: z.string().min(50).max(2000),
  anonymous: z.boolean(),
  wouldRentAgain: z.boolean(),
}).refine(
  (d) => d.landlordId !== undefined || d.newLandlordName !== undefined,
  { message: 'Either landlordId or newLandlordName must be provided' }
);

export type ReviewSubmit = z.infer<typeof ReviewSubmitSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  landlordId: z.string(),
  propertyId: z.string().optional(),
  locality: z.string(),
  bhk: z.number().int(),
  rentPerMonth: z.number().int(),
  tenancyStart: z.string(),
  tenancyEnd: z.string().optional(),
  ratings: RatingsSchema,
  depositAmount: z.number().int(),
  depositReturned: z.number().int(),
  freeText: z.string(),
  anonymous: z.boolean(),
  wouldRentAgain: z.boolean(),
  moderationStatus: z.enum(['pending', 'approved', 'rejected']),
  isDemo: z.boolean().default(false),
  createdAt: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;

// ─── Deposit Check ────────────────────────────────────────────────────────────

export const DepositCheckRequestSchema = z.object({
  monthlyRent: z.number().int().min(1000),
  depositAsked: z.number().int().min(0),
  depositAskedMonths: z.number().optional(),
  propertyType: z.enum(['residential', 'commercial']),
  locality: z.string(),
  leaseLength: z.number().int().min(1).max(120),
  isRegistered: z.boolean(),
  maintenanceCharge: z.number().int().min(0),
});

export type DepositCheckRequest = z.infer<typeof DepositCheckRequestSchema>;

export const DepositCheckResultSchema = z.object({
  verdict: z.enum(['Typical', 'High', 'Potentially excessive']),
  depositMonths: z.number(),
  norm: z.object({ min: z.number(), max: z.number() }),
  explanation: z.string(),
  legalContext: z.string(),
  negotiatingPoints: z.array(z.string()),
  redFlags: z.array(z.string()),
  documentChecklist: z.array(z.string()),
});

export type DepositCheckResult = z.infer<typeof DepositCheckResultSchema>;

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ─── Rights Article ───────────────────────────────────────────────────────────

export const RightsArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  content: z.string(),
  officialLinks: z.array(z.string()),
  needsLawyerVerification: z.boolean(),
  excerpt: z.string(),
});

export type RightsArticle = z.infer<typeof RightsArticleSchema>;

// ─── Locality ─────────────────────────────────────────────────────────────────

export const RentRangeSchema = z.object({
  bhk: z.number().int(),
  min: z.number().int(),
  max: z.number().int(),
});

export type RentRange = z.infer<typeof RentRangeSchema>;

export const LocalitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  zone: z.string(),
  rentRanges: z.array(RentRangeSchema),
  typicalDepositMonths: z.object({ min: z.number(), max: z.number() }),
  metroLine: z.string().optional(),
  metroStation: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  description: z.string(),
  rentTrend: z.array(z.object({ month: z.string(), avgRent: z.number() })),
});

export type Locality = z.infer<typeof LocalitySchema>;

// ─── Report ───────────────────────────────────────────────────────────────────

export const ReportSchema = z.object({
  targetType: z.enum(['review', 'landlord']),
  targetId: z.string(),
  reason: z.enum(['defamation', 'fake', 'pii', 'harassment', 'other']),
  details: z.string().max(500).optional(),
});

export type Report = z.infer<typeof ReportSchema>;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(50),
  total: z.number().int(),
  totalPages: z.number().int(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// ─── API error format ─────────────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// ─── Rent Fairness ────────────────────────────────────────────────────────────

export const RentFairnessRequestSchema = z.object({
  locality: z.string(),
  bhk: z.number().int().min(1).max(6),
  furnishing: z.enum(['unfurnished', 'semi-furnished', 'fully-furnished']),
  sqft: z.number().int().min(100).optional(),
  quotedRent: z.number().int().min(1000),
});

export type RentFairnessRequest = z.infer<typeof RentFairnessRequestSchema>;

export const RentFairnessResultSchema = z.object({
  fairRangeMin: z.number().int(),
  fairRangeMax: z.number().int(),
  quotedRent: z.number().int(),
  verdict: z.enum(['Below market', 'Within market', 'Above market']),
  percentDiff: z.number(),
  advice: z.string(),
});

export type RentFairnessResult = z.infer<typeof RentFairnessResultSchema>;
