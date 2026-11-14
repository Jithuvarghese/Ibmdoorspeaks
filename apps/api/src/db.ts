import { JSONFilePreset } from 'lowdb/node';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

export type DbSchema = {
  landlords: LandlordRow[];
  properties: PropertyRow[];
  reviews: ReviewRow[];
  localities: LocalityRow[];
  rights: RightsRow[];
  reports: ReportRow[];
};

export type LandlordRow = {
  id: string;
  name: string;
  localities: string[];
  avg_rating: number;
  review_count: number;
  badges: string[];
  is_demo: boolean;
  created_at: string;
};

export type PropertyRow = {
  id: string;
  landlord_id: string;
  locality: string;
  bhk: number;
  address: string;
  lat?: number;
  lng?: number;
};

export type ReviewRow = {
  id: string;
  landlord_id: string;
  property_id?: string;
  locality: string;
  bhk: number;
  rent_per_month: number;
  tenancy_start: string;
  tenancy_end?: string;
  rating_maintenance: number;
  rating_deposit_return: number;
  rating_privacy_respect: number;
  rating_rent_increase_fairness: number;
  rating_communication: number;
  deposit_amount: number;
  deposit_returned: number;
  free_text: string;
  anonymous: boolean;
  would_rent_again: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected';
  is_demo: boolean;
  created_at: string;
};

export type LocalityRow = {
  id: string;
  slug: string;
  name: string;
  zone: string;
  rent_ranges: string;
  typical_deposit_months: string;
  metro_line?: string;
  metro_station?: string;
  lat: number;
  lng: number;
  description: string;
  rent_trend: string;
};

export type RightsRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  official_links: string;
  needs_lawyer_verification: boolean;
  excerpt: string;
};

export type ReportRow = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details?: string;
  created_at: string;
};

const defaultData: DbSchema = {
  landlords: [],
  properties: [],
  reviews: [],
  localities: [],
  rights: [],
  reports: [],
};

let _db: Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>> | null = null;

export function resetDb(): void {
  _db = null;
}

export async function getDb(): Promise<Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>>> {
  if (_db) return _db;
  const dbPathEnv = process.env['DATABASE_PATH'] ?? './data/doorspeaks.json';

  // Support :memory: for tests
  if (dbPathEnv === ':memory:') {
    const { Low } = await import('lowdb');
    const { Memory } = await import('lowdb');
    _db = new Low<DbSchema>(new Memory<DbSchema>(), defaultData) as Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>>;
    await _db.read();
    return _db;
  }

  const dbPath = resolve(dbPathEnv);
  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  _db = await JSONFilePreset<DbSchema>(dbPath, defaultData);
  return _db;
}
