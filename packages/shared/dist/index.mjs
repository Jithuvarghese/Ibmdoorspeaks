// src/index.ts
import { z } from "zod";
var LandlordSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  localities: z.array(z.string()),
  avgRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  badges: z.array(z.string()),
  isDemo: z.boolean().default(false),
  createdAt: z.string()
});
var PropertySchema = z.object({
  id: z.string(),
  landlordId: z.string(),
  locality: z.string(),
  bhk: z.number().int().min(1).max(6),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional()
});
var RatingsSchema = z.object({
  maintenance: z.number().int().min(1).max(5),
  depositReturn: z.number().int().min(1).max(5),
  privacyRespect: z.number().int().min(1).max(5),
  rentIncreaseFairness: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5)
});
var ReviewSubmitSchema = z.object({
  landlordId: z.string().optional(),
  newLandlordName: z.string().min(2).max(100).optional(),
  locality: z.string().min(2).max(100),
  bhk: z.number().int().min(1).max(6),
  rentPerMonth: z.number().int().min(1e3).max(5e6),
  tenancyStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tenancyEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ratings: RatingsSchema,
  depositAmount: z.number().int().min(0),
  depositReturned: z.number().int().min(0),
  freeText: z.string().min(50).max(2e3),
  anonymous: z.boolean(),
  wouldRentAgain: z.boolean()
}).refine(
  (d) => d.landlordId !== void 0 || d.newLandlordName !== void 0,
  { message: "Either landlordId or newLandlordName must be provided" }
);
var ReviewSchema = z.object({
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
  moderationStatus: z.enum(["pending", "approved", "rejected"]),
  isDemo: z.boolean().default(false),
  createdAt: z.string()
});
var DepositCheckRequestSchema = z.object({
  monthlyRent: z.number().int().min(1e3),
  depositAsked: z.number().int().min(0),
  depositAskedMonths: z.number().optional(),
  propertyType: z.enum(["residential", "commercial"]),
  locality: z.string(),
  leaseLength: z.number().int().min(1).max(120),
  isRegistered: z.boolean(),
  maintenanceCharge: z.number().int().min(0)
});
var DepositCheckResultSchema = z.object({
  verdict: z.enum(["Typical", "High", "Potentially excessive"]),
  depositMonths: z.number(),
  norm: z.object({ min: z.number(), max: z.number() }),
  explanation: z.string(),
  legalContext: z.string(),
  negotiatingPoints: z.array(z.string()),
  redFlags: z.array(z.string()),
  documentChecklist: z.array(z.string())
});
var ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string()
});
var ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50)
});
var RightsArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  content: z.string(),
  officialLinks: z.array(z.string()),
  needsLawyerVerification: z.boolean(),
  excerpt: z.string()
});
var RentRangeSchema = z.object({
  bhk: z.number().int(),
  min: z.number().int(),
  max: z.number().int()
});
var LocalitySchema = z.object({
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
  rentTrend: z.array(z.object({ month: z.string(), avgRent: z.number() }))
});
var ReportSchema = z.object({
  targetType: z.enum(["review", "landlord"]),
  targetId: z.string(),
  reason: z.enum(["defamation", "fake", "pii", "harassment", "other"]),
  details: z.string().max(500).optional()
});
var PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(50),
  total: z.number().int(),
  totalPages: z.number().int()
});
var ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string()
  })
});
var RentFairnessRequestSchema = z.object({
  locality: z.string(),
  bhk: z.number().int().min(1).max(6),
  furnishing: z.enum(["unfurnished", "semi-furnished", "fully-furnished"]),
  sqft: z.number().int().min(100).optional(),
  quotedRent: z.number().int().min(1e3)
});
var RentFairnessResultSchema = z.object({
  fairRangeMin: z.number().int(),
  fairRangeMax: z.number().int(),
  quotedRent: z.number().int(),
  verdict: z.enum(["Below market", "Within market", "Above market"]),
  percentDiff: z.number(),
  advice: z.string()
});
export {
  ApiErrorSchema,
  ChatMessageSchema,
  ChatRequestSchema,
  DepositCheckRequestSchema,
  DepositCheckResultSchema,
  LandlordSchema,
  LocalitySchema,
  PaginationSchema,
  PropertySchema,
  RatingsSchema,
  RentFairnessRequestSchema,
  RentFairnessResultSchema,
  RentRangeSchema,
  ReportSchema,
  ReviewSchema,
  ReviewSubmitSchema,
  RightsArticleSchema
};
