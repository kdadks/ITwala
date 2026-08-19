// Country detection and currency utilities

import type { NextRequest } from 'next/server';

export interface CountryInfo {
  code: string;
  currency: string;
  symbol: string;
  name: string;
}

export interface CountryResolution {
  country: string;
  detected: boolean;
  source: 'cookie' | 'cloudflare' | 'vercel' | 'default';
}

export const SUPPORTED_COUNTRIES: Record<string, CountryInfo> = {
  US: { code: 'US', currency: 'USD', symbol: '$', name: 'United States' },
  GB: { code: 'GB', currency: 'GBP', symbol: '£', name: 'United Kingdom' },
  EU: { code: 'EU', currency: 'EUR', symbol: '€', name: 'European Union' },
  IN: { code: 'IN', currency: 'INR', symbol: '₹', name: 'India' },
};

export const DEFAULT_COUNTRY = 'IN';

// EU country codes to map to the shared 'EU' grouping
const EU_COUNTRY_CODES = [
  'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'IE', 'FI', 'SE', 'DK', 'PL', 'CZ', 'RO', 'HU',
];

function normalizeCountryCode(code: string): string {
  const upper = code.toUpperCase();
  const mapped = EU_COUNTRY_CODES.includes(upper) ? 'EU' : upper;
  return SUPPORTED_COUNTRIES[mapped] ? mapped : upper;
}

/**
 * Validate a raw country code and return the normalized supported code, or null.
 */
export function validateCountry(raw?: string): string | null {
  if (!raw) return null;
  const normalized = normalizeCountryCode(raw);
  return SUPPORTED_COUNTRIES[normalized] ? normalized : null;
}

/**
 * Resolve country from a Next.js request (server-side).
 * Priority: existing cookie → Cloudflare header → Vercel header → default.
 */
export function resolveCountryFromRequest(req: NextRequest): CountryResolution {
  // 1. Existing user_country cookie
  const cookie = req.cookies.get('user_country')?.value;
  if (cookie && SUPPORTED_COUNTRIES[cookie]) {
    return { country: cookie, detected: true, source: 'cookie' };
  }

  // 2. Cloudflare cf-ipcountry
  const cf = req.headers.get('cf-ipcountry')?.toUpperCase();
  if (cf) {
    if (EU_COUNTRY_CODES.includes(cf)) {
      return { country: 'EU', detected: true, source: 'cloudflare' };
    }
    if (SUPPORTED_COUNTRIES[cf]) {
      return { country: cf, detected: true, source: 'cloudflare' };
    }
  }

  // 3. Vercel x-vercel-ip-country
  const vercel = req.headers.get('x-vercel-ip-country')?.toUpperCase();
  if (vercel && SUPPORTED_COUNTRIES[vercel]) {
    return { country: vercel, detected: true, source: 'vercel' };
  }

  // 4. Safe fallback — not a detection, so we avoid persisting a sticky cookie
  return { country: DEFAULT_COUNTRY, detected: false, source: 'default' };
}

/**
 * Get country code from cookies (client-side)
 */
export function getCountryFromCookie(): string {
  if (typeof window === 'undefined') return DEFAULT_COUNTRY;

  const cookies = document.cookie.split(';');
  const countryCookie = cookies.find(c => c.trim().startsWith('user_country='));

  if (countryCookie) {
    const country = countryCookie.split('=')[1]?.trim();
    if (country && SUPPORTED_COUNTRIES[country]) {
      return country;
    }
  }

  return DEFAULT_COUNTRY;
}

/**
 * Set country code in cookie (client-side)
 */
export function setCountryInCookie(countryCode: string) {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `user_country=${countryCode}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Detect country from IP address.
 *
 * Production: goes through our server-side route which reads Cloudflare headers.
 * Local dev: the server sees 127.0.0.1 so can't determine the real country.
 *   In that case we fall back to calling ipapi.co directly from the browser,
 *   which uses the user's real public IP.
 */
export async function detectCountryFromIP(): Promise<string> {
  try {
    const response = await fetch('/api/analytics/get-country');
    if (!response.ok) return DEFAULT_COUNTRY;

    const data = await response.json();

    // If the server couldn't determine the country (local dev / private IP),
    // fall back to a direct browser-side lookup so the developer's real public
    // IP (e.g. an Irish IP) is used instead of defaulting to IN.
    if (!data.countryCode || data.source === 'localhost') {
      try {
        const ipRes = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000),
          headers: { 'User-Agent': 'ITWala-Academy/1.0' },
        });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.country_code) {
            return normalizeCountryCode(ipData.country_code);
          }
        }
      } catch {
        // ipapi.co unreachable – fall through to IN default
      }
      return DEFAULT_COUNTRY;
    }

    return normalizeCountryCode(data.countryCode);
  } catch (error) {
    console.error('Error detecting country:', error);
    return DEFAULT_COUNTRY;
  }
}

/**
 * Get country info (with fallback)
 */
export function getCountryInfo(countryCode?: string): CountryInfo {
  const code = countryCode || getCountryFromCookie();
  return SUPPORTED_COUNTRIES[code] || SUPPORTED_COUNTRIES[DEFAULT_COUNTRY];
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string): string {
  const country = Object.values(SUPPORTED_COUNTRIES).find(c => c.currency === currency);
  const symbol = country?.symbol || '₹';

  // Convert from smallest unit (cents/pence) to main unit
  const amount = price / 100;

  // Format with proper decimals
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get course price for user's country
 */
export async function getCoursePrice(courseId: string, countryCode?: string): Promise<{
  price: number;
  originalPrice?: number;
  currency: string;
  symbol: string;
} | null> {
  try {
    const country = countryCode || getCountryFromCookie();

    const response = await fetch(`/api/pricing/course?courseId=${courseId}&country=${country}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.pricing;
  } catch (error) {
    console.error('Error fetching course price:', error);
    return null;
  }
}
