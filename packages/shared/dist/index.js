"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ApiErrorSchema: () => ApiErrorSchema,
  ChatMessageSchema: () => ChatMessageSchema,
  ChatRequestSchema: () => ChatRequestSchema,
  DepositCheckRequestSchema: () => DepositCheckRequestSchema,
  DepositCheckResultSchema: () => DepositCheckResultSchema,
  LandlordSchema: () => LandlordSchema,
  LocalitySchema: () => LocalitySchema,
  PaginationSchema: () => PaginationSchema,
  PropertySchema: () => PropertySchema,
  RatingsSchema: () => RatingsSchema,
  RentFairnessRequestSchema: () => RentFairnessRequestSchema,
  RentFairnessResultSchema: () => RentFairnessResultSchema,
  RentRangeSchema: () => RentRangeSchema,
  ReportSchema: () => ReportSchema,
  ReviewSchema: () => ReviewSchema,
  ReviewSubmitSchema: () => ReviewSubmitSchema,
  RightsArticleSchema: () => RightsArticleSchema
});
module.exports = __toCommonJS(index_exports);
var import_zod = require("zod");
var LandlordSchema = import_zod.z.object({
  id: import_zod.z.string(),
  name: import_zod.z.string().min(2).max(100),
  localities: import_zod.z.array(import_zod.z.string()),
  avgRating: import_zod.z.number().min(0).max(5),
  reviewCount: import_zod.z.number().int().min(0),
  badges: import_zod.z.array(import_zod.z.string()),
  isDemo: import_zod.z.boolean().default(false),
  createdAt: import_zod.z.string()
});
var PropertySchema = import_zod.z.object({
  id: import_zod.z.string(),
  landlordId: import_zod.z.string(),
  locality: import_zod.z.string(),
  bhk: import_zod.z.number().int().min(1).max(6),
  address: import_zod.z.string(),
  lat: import_zod.z.number().optional(),
  lng: import_zod.z.number().optional()
});
var RatingsSchema = import_zod.z.object({
  maintenance: import_zod.z.number().int().min(1).max(5),
  depositReturn: import_zod.z.number().int().min(1).max(5),
  privacyRespect: import_zod.z.number().int().min(1).max(5),
  rentIncreaseFairness: import_zod.z.number().int().min(1).max(5),
  communication: import_zod.z.number().int().min(1).max(5)
});
var ReviewSubmitSchema = import_zod.z.object({
  landlordId: import_zod.z.string().optional(),
  newLandlordName: import_zod.z.string().min(2).max(100).optional(),
  locality: import_zod.z.string().min(2).max(100),
  bhk: import_zod.z.number().int().min(1).max(6),
  rentPerMonth: import_zod.z.number().int().min(1e3).max(5e6),
  tenancyStart: import_zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tenancyEnd: import_zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ratings: RatingsSchema,
  depositAmount: import_zod.z.number().int().min(0),
  depositReturned: import_zod.z.number().int().min(0),
  freeText: import_zod.z.string().min(50).max(2e3),
  anonymous: import_zod.z.boolean(),
  wouldRentAgain: import_zod.z.boolean()
}).refine(
  (d) => d.landlordId !== void 0 || d.newLandlordName !== void 0,
  { message: "Either landlordId or newLandlordName must be provided" }
);
var ReviewSchema = import_zod.z.object({
  id: import_zod.z.string(),
  landlordId: import_zod.z.string(),
  propertyId: import_zod.z.string().optional(),
  locality: import_zod.z.string(),
  bhk: import_zod.z.number().int(),
  rentPerMonth: import_zod.z.number().int(),
  tenancyStart: import_zod.z.string(),
  tenancyEnd: import_zod.z.string().optional(),
  ratings: RatingsSchema,
  depositAmount: import_zod.z.number().int(),
  depositReturned: import_zod.z.number().int(),
  freeText: import_zod.z.string(),
  anonymous: import_zod.z.boolean(),
  wouldRentAgain: import_zod.z.boolean(),
  moderationStatus: import_zod.z.enum(["pending", "approved", "rejected"]),
  isDemo: import_zod.z.boolean().default(false),
  createdAt: import_zod.z.string()
});
var DepositCheckRequestSchema = import_zod.z.object({
  monthlyRent: import_zod.z.number().int().min(1e3),
  depositAsked: import_zod.z.number().int().min(0),
  depositAskedMonths: import_zod.z.number().optional(),
  propertyType: import_zod.z.enum(["residential", "commercial"]),
  locality: import_zod.z.string(),
  leaseLength: import_zod.z.number().int().min(1).max(120),
  isRegistered: import_zod.z.boolean(),
  maintenanceCharge: import_zod.z.number().int().min(0)
});
var DepositCheckResultSchema = import_zod.z.object({
  verdict: import_zod.z.enum(["Typical", "High", "Potentially excessive"]),
  depositMonths: import_zod.z.number(),
  norm: import_zod.z.object({ min: import_zod.z.number(), max: import_zod.z.number() }),
  explanation: import_zod.z.string(),
  legalContext: import_zod.z.string(),
  negotiatingPoints: import_zod.z.array(import_zod.z.string()),
  redFlags: import_zod.z.array(import_zod.z.string()),
  documentChecklist: import_zod.z.array(import_zod.z.string())
});
var ChatMessageSchema = import_zod.z.object({
  role: import_zod.z.enum(["user", "assistant"]),
  content: import_zod.z.string()
});
var ChatRequestSchema = import_zod.z.object({
  messages: import_zod.z.array(ChatMessageSchema).min(1).max(50)
});
var RightsArticleSchema = import_zod.z.object({
  id: import_zod.z.string(),
  slug: import_zod.z.string(),
  title: import_zod.z.string(),
  category: import_zod.z.string(),
  content: import_zod.z.string(),
  officialLinks: import_zod.z.array(import_zod.z.string()),
  needsLawyerVerification: import_zod.z.boolean(),
  excerpt: import_zod.z.string()
});
var RentRangeSchema = import_zod.z.object({
  bhk: import_zod.z.number().int(),
  min: import_zod.z.number().int(),
  max: import_zod.z.number().int()
});
var LocalitySchema = import_zod.z.object({
  id: import_zod.z.string(),
  slug: import_zod.z.string(),
  name: import_zod.z.string(),
  zone: import_zod.z.string(),
  rentRanges: import_zod.z.array(RentRangeSchema),
  typicalDepositMonths: import_zod.z.object({ min: import_zod.z.number(), max: import_zod.z.number() }),
  metroLine: import_zod.z.string().optional(),
  metroStation: import_zod.z.string().optional(),
  lat: import_zod.z.number(),
  lng: import_zod.z.number(),
  description: import_zod.z.string(),
  rentTrend: import_zod.z.array(import_zod.z.object({ month: import_zod.z.string(), avgRent: import_zod.z.number() }))
});
var ReportSchema = import_zod.z.object({
  targetType: import_zod.z.enum(["review", "landlord"]),
  targetId: import_zod.z.string(),
  reason: import_zod.z.enum(["defamation", "fake", "pii", "harassment", "other"]),
  details: import_zod.z.string().max(500).optional()
});
var PaginationSchema = import_zod.z.object({
  page: import_zod.z.number().int().min(1),
  limit: import_zod.z.number().int().min(1).max(50),
  total: import_zod.z.number().int(),
  totalPages: import_zod.z.number().int()
});
var ApiErrorSchema = import_zod.z.object({
  error: import_zod.z.object({
    code: import_zod.z.string(),
    message: import_zod.z.string()
  })
});
var RentFairnessRequestSchema = import_zod.z.object({
  locality: import_zod.z.string(),
  bhk: import_zod.z.number().int().min(1).max(6),
  furnishing: import_zod.z.enum(["unfurnished", "semi-furnished", "fully-furnished"]),
  sqft: import_zod.z.number().int().min(100).optional(),
  quotedRent: import_zod.z.number().int().min(1e3)
});
var RentFairnessResultSchema = import_zod.z.object({
  fairRangeMin: import_zod.z.number().int(),
  fairRangeMax: import_zod.z.number().int(),
  quotedRent: import_zod.z.number().int(),
  verdict: import_zod.z.enum(["Below market", "Within market", "Above market"]),
  percentDiff: import_zod.z.number(),
  advice: import_zod.z.string()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
