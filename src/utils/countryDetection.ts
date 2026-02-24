// Country detection and currency utilities

export interface CountryInfo {
  code: string;
  currency: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_COUNTRIES: Record<string, CountryInfo> = {
  US: { code: 'US', currency: 'USD', symbol: '$', name: 'United States' },
  GB: { code: 'GB', currency: 'GBP', symbol: '£', name: 'United Kingdom' },
  EU: { code: 'EU', currency: 'EUR', symbol: '€', name: 'European Union' },
  IN: { code: 'IN', currency: 'INR', symbol: '₹', name: 'India' },
};

export const DEFAULT_COUNTRY = 'IN';

/**
 * Get country code from cookies
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
 * Set country code in cookie
 */
export function setCountryInCookie(countryCode: string) {
  if (typeof window === 'undefined') return;

  // Set cookie for 1 year
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = `user_country=${countryCode}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Detect country from IP address (using a free API)
 */
export async function detectCountryFromIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    let countryCode = data.country_code || DEFAULT_COUNTRY;

    // Map EU countries to EU
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'IE', 'FI', 'SE', 'DK', 'PL', 'CZ', 'RO', 'HU'];
    if (euCountries.includes(countryCode)) {
      countryCode = 'EU';
    }

    // Only return if it's a supported country
    if (SUPPORTED_COUNTRIES[countryCode]) {
      return countryCode;
    }

    return DEFAULT_COUNTRY;
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
