import { useState, useEffect } from 'react';
import { getCountryFromCookie, detectCountryFromIP, SUPPORTED_COUNTRIES } from '@/utils/countryDetection';

export function useUserCountry(initialCountry?: string) {
  const [userCountry, setUserCountry] = useState<string>(() => {
    // Server provides initialCountry on SSR/SSG.
    // Client falls back to cookie on hydration / client-side nav.
    if (initialCountry && SUPPORTED_COUNTRIES[initialCountry]) return initialCountry;
    if (typeof window !== 'undefined') return getCountryFromCookie();
    return 'IN';
  });

  // Sync with cookie on mount / when initialCountry changes.
  // Only sync from cookie when no server-provided initialCountry exists.
  // When initialCountry is provided, server resolution is authoritative.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialCountry) return;

    const cookieCountry = getCountryFromCookie();
    if (SUPPORTED_COUNTRIES[cookieCountry]) {
      setUserCountry(cookieCountry);
    }
  }, [initialCountry]);

  // Re-sync on focus (handles manual country selector changes in other tabs,
  // or delayed cookie availability after navigation).
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const handleFocus = () => {
      const cookieCountry = getCountryFromCookie();
      if (!cancelled && cookieCountry !== userCountry && SUPPORTED_COUNTRIES[cookieCountry]) {
        setUserCountry(cookieCountry);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleFocus);
    };
  }, [userCountry]);

  return { userCountry };
}
