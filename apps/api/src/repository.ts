import { getDb } from './db.js';
import type { Landlord, Property, Review, Locality, RightsArticle } from '@doorspeaks/shared';
import type { LandlordRow, PropertyRow, ReviewRow, LocalityRow, RightsRow } from './db.js';

// ─── Row <-> domain mappers ───────────────────────────────────────────────────

function rowToLandlord(row: LandlordRow): Landlord {
  return {
    id: row.id,
    name: row.name,
    localities: row.localities,
    avgRating: row.avg_rating,
    reviewCount: row.review_count,
    badges: row.badges,
    isDemo: row.is_demo,
    createdAt: row.created_at,
  };
}

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    landlordId: row.landlord_id,
    locality: row.locality,
    bhk: row.bhk,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
  };
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    landlordId: row.landlord_id,
    propertyId: row.property_id,
    locality: row.locality,
    bhk: row.bhk,
    rentPerMonth: row.rent_per_month,
    tenancyStart: row.tenancy_start,
    tenancyEnd: row.tenancy_end,
    ratings: {
      maintenance: row.rating_maintenance,
      depositReturn: row.rating_deposit_return,
      privacyRespect: row.rating_privacy_respect,
      rentIncreaseFairness: row.rating_rent_increase_fairness,
      communication: row.rating_communication,
    },
    depositAmount: row.deposit_amount,
    depositReturned: row.deposit_returned,
    freeText: row.free_text,
    anonymous: row.anonymous,
    wouldRentAgain: row.would_rent_again,
    moderationStatus: row.moderation_status,
    isDemo: row.is_demo,
    createdAt: row.created_at,
  };
}

function rowToLocality(row: LocalityRow): Locality {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    zone: row.zone,
    rentRanges: JSON.parse(row.rent_ranges),
    typicalDepositMonths: JSON.parse(row.typical_deposit_months),
    metroLine: row.metro_line,
    metroStation: row.metro_station,
    lat: row.lat,
    lng: row.lng,
    description: row.description,
    rentTrend: JSON.parse(row.rent_trend),
  };
}

function rowToArticle(row: RightsRow): RightsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    content: row.content,
    officialLinks: JSON.parse(row.official_links),
    needsLawyerVerification: row.needs_lawyer_verification,
    excerpt: row.excerpt,
  };
}

// ─── Landlord Repository ──────────────────────────────────────────────────────

export const LandlordRepo = {
  async search(opts: {
    q?: string;
    locality?: string;
    minRating?: number;
    sort?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Landlord[]; total: number }> {
    const db = await getDb();
    let rows = [...db.data.landlords];

    if (opts.q) {
      const ql = opts.q.toLowerCase();
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(ql) || r.localities.some((l) => l.toLowerCase().includes(ql))
      );
    }
    if (opts.locality) {
      const ll = opts.locality.toLowerCase();
      rows = rows.filter((r) => r.localities.some((l) => l.toLowerCase().includes(ll)));
    }
    if (opts.minRating !== undefined) {
      rows = rows.filter((r) => r.avg_rating >= (opts.minRating ?? 0));
    }

    // Sort
    if (opts.sort === 'reviews') rows.sort((a, b) => b.review_count - a.review_count);
    else if (opts.sort === 'recent') rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else rows.sort((a, b) => b.avg_rating - a.avg_rating);

    const total = rows.length;
    const offset = (opts.page - 1) * opts.limit;
    const page = rows.slice(offset, offset + opts.limit);
    return { data: page.map(rowToLandlord), total };
  },

  async findById(id: string): Promise<Landlord | null> {
    const db = await getDb();
    const row = db.data.landlords.find((r) => r.id === id);
    return row ? rowToLandlord(row) : null;
  },

  async insert(landlord: Landlord): Promise<void> {
    const db = await getDb();
    db.data.landlords.push({
      id: landlord.id,
      name: landlord.name,
      localities: landlord.localities,
      avg_rating: landlord.avgRating,
      review_count: landlord.reviewCount,
      badges: landlord.badges,
      is_demo: landlord.isDemo ?? false,
      created_at: landlord.createdAt,
    });
    await db.write();
  },

  async updateStats(landlordId: string): Promise<void> {
    const db = await getDb();
    const reviews = db.data.reviews.filter(
      (r) => r.landlord_id === landlordId && r.moderation_status === 'approved'
    );

    const cnt = reviews.length;
    const avg =
      cnt > 0
        ? reviews.reduce(
            (sum, r) =>
              sum +
              (r.rating_maintenance +
                r.rating_deposit_return +
                r.rating_privacy_respect +
                r.rating_rent_increase_fairness +
                r.rating_communication) /
                5,
            0
          ) / cnt
        : 0;

    const badges: string[] = [];
    if (cnt >= 5) badges.push('Rated by 5+ tenants');

    const depositReviews = reviews.filter((r) => r.deposit_amount > 0);
    if (depositReviews.length > 0) {
      const ratio =
        depositReviews.reduce((sum, r) => sum + r.deposit_returned / r.deposit_amount, 0) /
        depositReviews.length;
      if (ratio >= 0.9) badges.push('Prompt deposit returner');
    }

    // Recompute localities from reviews
    const locs = [...new Set(reviews.map((r) => r.locality))];

    const idx = db.data.landlords.findIndex((l) => l.id === landlordId);
    if (idx !== -1) {
      const existing = db.data.landlords[idx];
      if (existing) {
        existing.avg_rating = Math.round(avg * 10) / 10;
        existing.review_count = cnt;
        existing.badges = badges;
        if (locs.length > 0) existing.localities = locs;
      }
    }
    await db.write();
  },

  async upsertName(name: string, id: string): Promise<void> {
    const db = await getDb();
    if (!db.data.landlords.find((l) => l.id === id)) {
      db.data.landlords.push({
        id,
        name,
        localities: [],
        avg_rating: 0,
        review_count: 0,
        badges: [],
        is_demo: false,
        created_at: new Date().toISOString(),
      });
      await db.write();
    }
  },
};

// ─── Property Repository ──────────────────────────────────────────────────────

export const PropertyRepo = {
  async findByLandlord(landlordId: string): Promise<Property[]> {
    const db = await getDb();
    return db.data.properties
      .filter((r) => r.landlord_id === landlordId)
      .map(rowToProperty);
  },

  async insert(prop: Property): Promise<void> {
    const db = await getDb();
    db.data.properties.push({
      id: prop.id,
      landlord_id: prop.landlordId,
      locality: prop.locality,
      bhk: prop.bhk,
      address: prop.address,
      lat: prop.lat,
      lng: prop.lng,
    });
    await db.write();
  },
};

// ─── Review Repository ────────────────────────────────────────────────────────

export const ReviewRepo = {
  async findByLandlord(
    landlordId: string,
    page = 1,
    limit = 20
  ): Promise<{ data: Review[]; total: number }> {
    const db = await getDb();
    const all = db.data.reviews
      .filter((r) => r.landlord_id === landlordId && r.moderation_status === 'approved')
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    const total = all.length;
    const sliced = all.slice((page - 1) * limit, page * limit);
    return { data: sliced.map(rowToReview), total };
  },

  async pending(): Promise<Review[]> {
    const db = await getDb();
    return db.data.reviews
      .filter((r) => r.moderation_status === 'pending')
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(rowToReview);
  },

  async findById(id: string): Promise<Review | null> {
    const db = await getDb();
    const row = db.data.reviews.find((r) => r.id === id);
    return row ? rowToReview(row) : null;
  },

  async insert(review: Review): Promise<void> {
    const db = await getDb();
    db.data.reviews.push({
      id: review.id,
      landlord_id: review.landlordId,
      property_id: review.propertyId,
      locality: review.locality,
      bhk: review.bhk,
      rent_per_month: review.rentPerMonth,
      tenancy_start: review.tenancyStart,
      tenancy_end: review.tenancyEnd,
      rating_maintenance: review.ratings.maintenance,
      rating_deposit_return: review.ratings.depositReturn,
      rating_privacy_respect: review.ratings.privacyRespect,
      rating_rent_increase_fairness: review.ratings.rentIncreaseFairness,
      rating_communication: review.ratings.communication,
      deposit_amount: review.depositAmount,
      deposit_returned: review.depositReturned,
      free_text: review.freeText,
      anonymous: review.anonymous,
      would_rent_again: review.wouldRentAgain,
      moderation_status: review.moderationStatus,
      is_demo: review.isDemo ?? false,
      created_at: review.createdAt,
    });
    await db.write();
  },

  async updateStatus(id: string, status: Review['moderationStatus']): Promise<boolean> {
    const db = await getDb();
    const row = db.data.reviews.find((r) => r.id === id);
    if (!row) return false;
    row.moderation_status = status;
    await db.write();
    return true;
  },
};

// ─── Locality Repository ──────────────────────────────────────────────────────

export const LocalityRepo = {
  async findAll(): Promise<Locality[]> {
    const db = await getDb();
    return [...db.data.localities].sort((a, b) => a.name.localeCompare(b.name)).map(rowToLocality);
  },

  async findBySlug(slug: string): Promise<Locality | null> {
    const db = await getDb();
    const row = db.data.localities.find((r) => r.slug === slug);
    return row ? rowToLocality(row) : null;
  },

  async insert(loc: Locality): Promise<void> {
    const db = await getDb();
    // Upsert by slug
    const idx = db.data.localities.findIndex((r) => r.slug === loc.slug);
    const row: LocalityRow = {
      id: loc.id,
      slug: loc.slug,
      name: loc.name,
      zone: loc.zone,
      rent_ranges: JSON.stringify(loc.rentRanges),
      typical_deposit_months: JSON.stringify(loc.typicalDepositMonths),
      metro_line: loc.metroLine,
      metro_station: loc.metroStation,
      lat: loc.lat,
      lng: loc.lng,
      description: loc.description,
      rent_trend: JSON.stringify(loc.rentTrend),
    };
    if (idx !== -1) {
      db.data.localities[idx] = row;
    } else {
      db.data.localities.push(row);
    }
    await db.write();
  },
};

// ─── Rights Repository ────────────────────────────────────────────────────────

export const RightsRepo = {
  async findAll(): Promise<RightsArticle[]> {
    const db = await getDb();
    return [...db.data.rights]
      .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
      .map(rowToArticle);
  },

  async findBySlug(slug: string): Promise<RightsArticle | null> {
    const db = await getDb();
    const row = db.data.rights.find((r) => r.slug === slug);
    return row ? rowToArticle(row) : null;
  },

  async insert(article: RightsArticle): Promise<void> {
    const db = await getDb();
    const idx = db.data.rights.findIndex((r) => r.slug === article.slug);
    const row: RightsRow = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category,
      content: article.content,
      official_links: JSON.stringify(article.officialLinks),
      needs_lawyer_verification: article.needsLawyerVerification,
      excerpt: article.excerpt,
    };
    if (idx !== -1) {
      db.data.rights[idx] = row;
    } else {
      db.data.rights.push(row);
    }
    await db.write();
  },
};

// ─── Report Repository ────────────────────────────────────────────────────────

export const ReportRepo = {
  async insert(report: {
    id: string;
    targetType: string;
    targetId: string;
    reason: string;
    details?: string;
    createdAt: string;
  }): Promise<void> {
    const db = await getDb();
    db.data.reports.push({
      id: report.id,
      target_type: report.targetType,
      target_id: report.targetId,
      reason: report.reason,
      details: report.details,
      created_at: report.createdAt,
    });
    await db.write();
  },
};
