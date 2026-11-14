import { z } from 'zod';

declare const LandlordSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    localities: z.ZodArray<z.ZodString, "many">;
    avgRating: z.ZodNumber;
    reviewCount: z.ZodNumber;
    badges: z.ZodArray<z.ZodString, "many">;
    isDemo: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    localities: string[];
    avgRating: number;
    reviewCount: number;
    badges: string[];
    isDemo: boolean;
    createdAt: string;
}, {
    id: string;
    name: string;
    localities: string[];
    avgRating: number;
    reviewCount: number;
    badges: string[];
    createdAt: string;
    isDemo?: boolean | undefined;
}>;
type Landlord = z.infer<typeof LandlordSchema>;
declare const PropertySchema: z.ZodObject<{
    id: z.ZodString;
    landlordId: z.ZodString;
    locality: z.ZodString;
    bhk: z.ZodNumber;
    address: z.ZodString;
    lat: z.ZodOptional<z.ZodNumber>;
    lng: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    landlordId: string;
    locality: string;
    bhk: number;
    address: string;
    lat?: number | undefined;
    lng?: number | undefined;
}, {
    id: string;
    landlordId: string;
    locality: string;
    bhk: number;
    address: string;
    lat?: number | undefined;
    lng?: number | undefined;
}>;
type Property = z.infer<typeof PropertySchema>;
declare const RatingsSchema: z.ZodObject<{
    maintenance: z.ZodNumber;
    depositReturn: z.ZodNumber;
    privacyRespect: z.ZodNumber;
    rentIncreaseFairness: z.ZodNumber;
    communication: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    maintenance: number;
    depositReturn: number;
    privacyRespect: number;
    rentIncreaseFairness: number;
    communication: number;
}, {
    maintenance: number;
    depositReturn: number;
    privacyRespect: number;
    rentIncreaseFairness: number;
    communication: number;
}>;
type Ratings = z.infer<typeof RatingsSchema>;
declare const ReviewSubmitSchema: z.ZodEffects<z.ZodObject<{
    landlordId: z.ZodOptional<z.ZodString>;
    newLandlordName: z.ZodOptional<z.ZodString>;
    locality: z.ZodString;
    bhk: z.ZodNumber;
    rentPerMonth: z.ZodNumber;
    tenancyStart: z.ZodString;
    tenancyEnd: z.ZodOptional<z.ZodString>;
    ratings: z.ZodObject<{
        maintenance: z.ZodNumber;
        depositReturn: z.ZodNumber;
        privacyRespect: z.ZodNumber;
        rentIncreaseFairness: z.ZodNumber;
        communication: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    }, {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    }>;
    depositAmount: z.ZodNumber;
    depositReturned: z.ZodNumber;
    freeText: z.ZodString;
    anonymous: z.ZodBoolean;
    wouldRentAgain: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    landlordId?: string | undefined;
    newLandlordName?: string | undefined;
    tenancyEnd?: string | undefined;
}, {
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    landlordId?: string | undefined;
    newLandlordName?: string | undefined;
    tenancyEnd?: string | undefined;
}>, {
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    landlordId?: string | undefined;
    newLandlordName?: string | undefined;
    tenancyEnd?: string | undefined;
}, {
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    landlordId?: string | undefined;
    newLandlordName?: string | undefined;
    tenancyEnd?: string | undefined;
}>;
type ReviewSubmit = z.infer<typeof ReviewSubmitSchema>;
declare const ReviewSchema: z.ZodObject<{
    id: z.ZodString;
    landlordId: z.ZodString;
    propertyId: z.ZodOptional<z.ZodString>;
    locality: z.ZodString;
    bhk: z.ZodNumber;
    rentPerMonth: z.ZodNumber;
    tenancyStart: z.ZodString;
    tenancyEnd: z.ZodOptional<z.ZodString>;
    ratings: z.ZodObject<{
        maintenance: z.ZodNumber;
        depositReturn: z.ZodNumber;
        privacyRespect: z.ZodNumber;
        rentIncreaseFairness: z.ZodNumber;
        communication: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    }, {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    }>;
    depositAmount: z.ZodNumber;
    depositReturned: z.ZodNumber;
    freeText: z.ZodString;
    anonymous: z.ZodBoolean;
    wouldRentAgain: z.ZodBoolean;
    moderationStatus: z.ZodEnum<["pending", "approved", "rejected"]>;
    isDemo: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    isDemo: boolean;
    createdAt: string;
    landlordId: string;
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    moderationStatus: "pending" | "approved" | "rejected";
    tenancyEnd?: string | undefined;
    propertyId?: string | undefined;
}, {
    id: string;
    createdAt: string;
    landlordId: string;
    locality: string;
    bhk: number;
    rentPerMonth: number;
    tenancyStart: string;
    ratings: {
        maintenance: number;
        depositReturn: number;
        privacyRespect: number;
        rentIncreaseFairness: number;
        communication: number;
    };
    depositAmount: number;
    depositReturned: number;
    freeText: string;
    anonymous: boolean;
    wouldRentAgain: boolean;
    moderationStatus: "pending" | "approved" | "rejected";
    isDemo?: boolean | undefined;
    tenancyEnd?: string | undefined;
    propertyId?: string | undefined;
}>;
type Review = z.infer<typeof ReviewSchema>;
declare const DepositCheckRequestSchema: z.ZodObject<{
    monthlyRent: z.ZodNumber;
    depositAsked: z.ZodNumber;
    depositAskedMonths: z.ZodOptional<z.ZodNumber>;
    propertyType: z.ZodEnum<["residential", "commercial"]>;
    locality: z.ZodString;
    leaseLength: z.ZodNumber;
    isRegistered: z.ZodBoolean;
    maintenanceCharge: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    locality: string;
    monthlyRent: number;
    depositAsked: number;
    propertyType: "residential" | "commercial";
    leaseLength: number;
    isRegistered: boolean;
    maintenanceCharge: number;
    depositAskedMonths?: number | undefined;
}, {
    locality: string;
    monthlyRent: number;
    depositAsked: number;
    propertyType: "residential" | "commercial";
    leaseLength: number;
    isRegistered: boolean;
    maintenanceCharge: number;
    depositAskedMonths?: number | undefined;
}>;
type DepositCheckRequest = z.infer<typeof DepositCheckRequestSchema>;
declare const DepositCheckResultSchema: z.ZodObject<{
    verdict: z.ZodEnum<["Typical", "High", "Potentially excessive"]>;
    depositMonths: z.ZodNumber;
    norm: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>;
    explanation: z.ZodString;
    legalContext: z.ZodString;
    negotiatingPoints: z.ZodArray<z.ZodString, "many">;
    redFlags: z.ZodArray<z.ZodString, "many">;
    documentChecklist: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    verdict: "Typical" | "High" | "Potentially excessive";
    depositMonths: number;
    norm: {
        min: number;
        max: number;
    };
    explanation: string;
    legalContext: string;
    negotiatingPoints: string[];
    redFlags: string[];
    documentChecklist: string[];
}, {
    verdict: "Typical" | "High" | "Potentially excessive";
    depositMonths: number;
    norm: {
        min: number;
        max: number;
    };
    explanation: string;
    legalContext: string;
    negotiatingPoints: string[];
    redFlags: string[];
    documentChecklist: string[];
}>;
type DepositCheckResult = z.infer<typeof DepositCheckResultSchema>;
declare const ChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant";
    content: string;
}, {
    role: "user" | "assistant";
    content: string;
}>;
type ChatMessage = z.infer<typeof ChatMessageSchema>;
declare const ChatRequestSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "assistant";
        content: string;
    }, {
        role: "user" | "assistant";
        content: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    messages: {
        role: "user" | "assistant";
        content: string;
    }[];
}, {
    messages: {
        role: "user" | "assistant";
        content: string;
    }[];
}>;
type ChatRequest = z.infer<typeof ChatRequestSchema>;
declare const RightsArticleSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    title: z.ZodString;
    category: z.ZodString;
    content: z.ZodString;
    officialLinks: z.ZodArray<z.ZodString, "many">;
    needsLawyerVerification: z.ZodBoolean;
    excerpt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    content: string;
    slug: string;
    title: string;
    category: string;
    officialLinks: string[];
    needsLawyerVerification: boolean;
    excerpt: string;
}, {
    id: string;
    content: string;
    slug: string;
    title: string;
    category: string;
    officialLinks: string[];
    needsLawyerVerification: boolean;
    excerpt: string;
}>;
type RightsArticle = z.infer<typeof RightsArticleSchema>;
declare const RentRangeSchema: z.ZodObject<{
    bhk: z.ZodNumber;
    min: z.ZodNumber;
    max: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    bhk: number;
    min: number;
    max: number;
}, {
    bhk: number;
    min: number;
    max: number;
}>;
type RentRange = z.infer<typeof RentRangeSchema>;
declare const LocalitySchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    zone: z.ZodString;
    rentRanges: z.ZodArray<z.ZodObject<{
        bhk: z.ZodNumber;
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        bhk: number;
        min: number;
        max: number;
    }, {
        bhk: number;
        min: number;
        max: number;
    }>, "many">;
    typicalDepositMonths: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>;
    metroLine: z.ZodOptional<z.ZodString>;
    metroStation: z.ZodOptional<z.ZodString>;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    description: z.ZodString;
    rentTrend: z.ZodArray<z.ZodObject<{
        month: z.ZodString;
        avgRent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        month: string;
        avgRent: number;
    }, {
        month: string;
        avgRent: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    lat: number;
    lng: number;
    slug: string;
    zone: string;
    rentRanges: {
        bhk: number;
        min: number;
        max: number;
    }[];
    typicalDepositMonths: {
        min: number;
        max: number;
    };
    description: string;
    rentTrend: {
        month: string;
        avgRent: number;
    }[];
    metroLine?: string | undefined;
    metroStation?: string | undefined;
}, {
    id: string;
    name: string;
    lat: number;
    lng: number;
    slug: string;
    zone: string;
    rentRanges: {
        bhk: number;
        min: number;
        max: number;
    }[];
    typicalDepositMonths: {
        min: number;
        max: number;
    };
    description: string;
    rentTrend: {
        month: string;
        avgRent: number;
    }[];
    metroLine?: string | undefined;
    metroStation?: string | undefined;
}>;
type Locality = z.infer<typeof LocalitySchema>;
declare const ReportSchema: z.ZodObject<{
    targetType: z.ZodEnum<["review", "landlord"]>;
    targetId: z.ZodString;
    reason: z.ZodEnum<["defamation", "fake", "pii", "harassment", "other"]>;
    details: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    targetType: "review" | "landlord";
    targetId: string;
    reason: "defamation" | "fake" | "pii" | "harassment" | "other";
    details?: string | undefined;
}, {
    targetType: "review" | "landlord";
    targetId: string;
    reason: "defamation" | "fake" | "pii" | "harassment" | "other";
    details?: string | undefined;
}>;
type Report = z.infer<typeof ReportSchema>;
declare const PaginationSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
type Pagination = z.infer<typeof PaginationSchema>;
declare const ApiErrorSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string;
        message: string;
    };
}, {
    error: {
        code: string;
        message: string;
    };
}>;
type ApiError = z.infer<typeof ApiErrorSchema>;
declare const RentFairnessRequestSchema: z.ZodObject<{
    locality: z.ZodString;
    bhk: z.ZodNumber;
    furnishing: z.ZodEnum<["unfurnished", "semi-furnished", "fully-furnished"]>;
    sqft: z.ZodOptional<z.ZodNumber>;
    quotedRent: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    locality: string;
    bhk: number;
    furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
    quotedRent: number;
    sqft?: number | undefined;
}, {
    locality: string;
    bhk: number;
    furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
    quotedRent: number;
    sqft?: number | undefined;
}>;
type RentFairnessRequest = z.infer<typeof RentFairnessRequestSchema>;
declare const RentFairnessResultSchema: z.ZodObject<{
    fairRangeMin: z.ZodNumber;
    fairRangeMax: z.ZodNumber;
    quotedRent: z.ZodNumber;
    verdict: z.ZodEnum<["Below market", "Within market", "Above market"]>;
    percentDiff: z.ZodNumber;
    advice: z.ZodString;
}, "strip", z.ZodTypeAny, {
    verdict: "Below market" | "Within market" | "Above market";
    quotedRent: number;
    fairRangeMin: number;
    fairRangeMax: number;
    percentDiff: number;
    advice: string;
}, {
    verdict: "Below market" | "Within market" | "Above market";
    quotedRent: number;
    fairRangeMin: number;
    fairRangeMax: number;
    percentDiff: number;
    advice: string;
}>;
type RentFairnessResult = z.infer<typeof RentFairnessResultSchema>;

export { type ApiError, ApiErrorSchema, type ChatMessage, ChatMessageSchema, type ChatRequest, ChatRequestSchema, type DepositCheckRequest, DepositCheckRequestSchema, type DepositCheckResult, DepositCheckResultSchema, type Landlord, LandlordSchema, type Locality, LocalitySchema, type Pagination, PaginationSchema, type Property, PropertySchema, type Ratings, RatingsSchema, type RentFairnessRequest, RentFairnessRequestSchema, type RentFairnessResult, RentFairnessResultSchema, type RentRange, RentRangeSchema, type Report, ReportSchema, type Review, ReviewSchema, type ReviewSubmit, ReviewSubmitSchema, type RightsArticle, RightsArticleSchema };
