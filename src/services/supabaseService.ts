/**
 * Centralised Supabase service layer.
 *
 * All direct Supabase data-access should go through helpers defined here so
 * that error handling, logging, and future data-source swaps live in one place.
 * Components and utilities import from this file instead of reaching for the
 * raw client directly.
 */

import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

export class ServiceError extends Error {
  public readonly code?: string;
  public readonly details?: string;

  constructor(message: string, cause?: PostgrestError) {
    super(message);
    this.name = 'ServiceError';
    this.code = cause?.code;
    this.details = cause?.details ?? cause?.hint;
  }
}

/**
 * Unwraps a Supabase query result, throwing a `ServiceError` on failure.
 * Use this as a one-liner around any `.from(...).select(...)` etc. call.
 */
export function unwrap<T>(result: { data: T | null; error: PostgrestError | null }): T {
  if (result.error) {
    throw new ServiceError(result.error.message, result.error);
  }
  if (result.data === null) {
    throw new ServiceError('No data returned');
  }
  return result.data;
}

/**
 * Like `unwrap` but returns `null` instead of throwing when there is no data.
 * Useful for queries that legitimately return zero rows (`.maybeSingle()`).
 */
export function unwrapOrNull<T>(
  result: { data: T | null; error: PostgrestError | null }
): T | null {
  if (result.error) {
    throw new ServiceError(result.error.message, result.error);
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export interface SiteSettings {
  id?: string;
  siteName: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  enrollmentsEnabled: boolean;
}

const SITE_SETTINGS_TABLE = 'site_settings';

const mapRowToSettings = (row: Record<string, unknown>): SiteSettings => ({
  id: row.id as string | undefined,
  siteName: row.site_name as string,
  contactEmail: row.contact_email as string,
  supportPhone: row.support_phone as string,
  maintenanceMode: row.maintenance_mode as boolean,
  enrollmentsEnabled: row.enrollments_enabled as boolean,
});

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const result = await supabase
    .from(SITE_SETTINGS_TABLE)
    .select('*')
    .limit(1)
    .single();
  return mapRowToSettings(unwrap(result));
}

export async function upsertSiteSettings(settings: SiteSettings): Promise<void> {
  const payload: Record<string, unknown> = {
    site_name: settings.siteName,
    contact_email: settings.contactEmail,
    support_phone: settings.supportPhone,
    maintenance_mode: settings.maintenanceMode,
    enrollments_enabled: settings.enrollmentsEnabled,
  };
  if (settings.id) {
    const result = await supabase
      .from(SITE_SETTINGS_TABLE)
      .update(payload)
      .eq('id', settings.id);
    unwrapOrNull(result);
  } else {
    const result = await supabase.from(SITE_SETTINGS_TABLE).insert([payload]);
    unwrapOrNull(result);
  }
}

export async function seedSiteSettingsIfEmpty(): Promise<void> {
  const existing = await supabase
    .from(SITE_SETTINGS_TABLE)
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing.error) {
    // Table may not exist yet; defer to migrations.
    if (existing.error.message.includes('does not exist')) return;
    throw new ServiceError(existing.error.message, existing.error);
  }

  if (!existing.data) {
    const result = await supabase.from(SITE_SETTINGS_TABLE).insert([
      {
        site_name: 'ITwala Academy',
        contact_email: 'sales@it-wala.com',
        support_phone: '+91 7982303199',
        maintenance_mode: false,
        enrollments_enabled: true,
      },
    ]);
    unwrapOrNull(result);
  }
}

// ---------------------------------------------------------------------------
// Analytics helpers
// ---------------------------------------------------------------------------

export interface PageViewRecord {
  session_id: string;
  page_url: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  country: string;
  device_type: string;
  browser: string;
}

export async function insertPageView(
  client: SupabaseClient,
  record: PageViewRecord
): Promise<void> {
  const result = await client.from('page_views').insert([record]);
  unwrapOrNull(result);
}

export async function updatePageViewDuration(
  client: SupabaseClient,
  sessionId: string,
  pageUrl: string,
  durationSeconds: number
): Promise<void> {
  await client
    .from('page_views')
    .update({ duration_seconds: durationSeconds })
    .eq('session_id', sessionId)
    .eq('page_url', pageUrl)
    .order('created_at', { ascending: false })
    .limit(1);
}

export async function insertAnalyticsEvent(
  client: SupabaseClient,
  eventName: string,
  eventData: Record<string, unknown>,
  pageUrl: string,
  sessionId: string
): Promise<void> {
  const result = await client.from('analytics_events').insert([
    { event_name: eventName, event_data: eventData, page_url: pageUrl, session_id: sessionId },
  ]);
  unwrapOrNull(result);
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  full_name?: string;
  role: 'admin' | 'instructor' | 'student';
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  phone?: string;
  student_id?: string | null;
  date_of_birth?: string | null;
  parent_name?: string | null;
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return unwrapOrNull(result) as ProfileRow | null;
}

export async function upsertProfile(
  profile: Partial<ProfileRow> & { id: string }
): Promise<void> {
  const result = await supabase.from('profiles').upsert(profile);
  unwrapOrNull(result);
}

export async function updateProfile(
  userId: string,
  data: Partial<ProfileRow>
): Promise<void> {
  const result = await supabase.from('profiles').update(data).eq('id', userId);
  unwrapOrNull(result);
}

// ---------------------------------------------------------------------------
// Re-export raw clients for cases that genuinely need them
// (prefer the helpers above whenever possible)
// ---------------------------------------------------------------------------
export { supabase, supabaseAdmin };
