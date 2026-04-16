import { SupabaseClient } from '@supabase/supabase-js';
import {
  insertPageView,
  updatePageViewDuration,
  insertAnalyticsEvent,
} from '@/services/supabaseService';

interface PageViewData {
  page_url: string;
  page_title: string;
  referrer: string;
  country: string;
  city: string;
  region: string;
  device_type: string;
  browser: string;
  os: string;
  screen_resolution: string;
  language: string;
  session_id: string;
  user_agent: string;
}

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';

  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Browser';
  else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';
  else if (ua.indexOf('Trident') > -1) browser = 'Internet Explorer';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge (Legacy)';
  else if (ua.indexOf('Edg') > -1) browser = 'Edge (Chromium)';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';

  return browser;
};

// Detect operating system
const getOS = (): string => {
  const ua = navigator.userAgent;
  let os = 'Unknown';

  if (ua.indexOf('Win') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'MacOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('like Mac') > -1) os = 'iOS';

  return os;
};

// Get location data from IP (using ipapi.co free API)
const getLocationData = async (): Promise<{ country: string; city: string; region: string }> => {
  try {
    // Check if we have cached location data (valid for 24 hours)
    const cached = localStorage.getItem('user_location');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      if (age < 24 * 60 * 60 * 1000) { // 24 hours
        return data;
      }
    }

    // Fetch new location data
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const location = {
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
      };

      // Cache the result
      localStorage.setItem('user_location', JSON.stringify({
        data: location,
        timestamp: Date.now()
      }));

      return location;
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }

  return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
};

// Check if analytics consent is given
const hasAnalyticsConsent = (): boolean => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;

  try {
    const prefs = JSON.parse(consent);
    return prefs.analytics === true;
  } catch {
    return false;
  }
};

// Track page view
export const trackPageView = async (supabase: SupabaseClient): Promise<void> => {
  // Skip tracking outside production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Skip tracking on localhost (belt-and-suspenders for non-standard NODE_ENV)
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return;
  }

  // Check for analytics consent
  if (!hasAnalyticsConsent()) {
    return;
  }

  try {
    const startTime = Date.now();

    // Get location data
    const location = await getLocationData();

    const sessionId = getSessionId();
    const pageUrl = window.location.pathname;

    const dbData = {
      session_id: sessionId,
      page_url: pageUrl,
      page_title: document.title,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      country: location.country,
      device_type: getDeviceType(),
      browser: getBrowser(),
    };

    await insertPageView(supabase, dbData);

    // Track time on page when user leaves
    const trackTimeOnPage = () => {
      const duration_seconds = Math.round((Date.now() - startTime) / 1000);
      updatePageViewDuration(supabase, sessionId, pageUrl, duration_seconds).catch(
        (err: unknown) => console.error('Error updating page duration:', err)
      );
    };

    window.addEventListener('beforeunload', trackTimeOnPage);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackTimeOnPage();
      }
    });
  } catch (error: unknown) {
    console.error('Error in trackPageView:', error);
  }
};

// Track custom event
export const trackEvent = async (
  supabase: SupabaseClient,
  eventName: string,
  eventData?: Record<string, unknown>
): Promise<void> => {
  // Skip tracking outside production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  try {
    await insertAnalyticsEvent(
      supabase,
      eventName,
      eventData ?? {},
      window.location.pathname,
      getSessionId()
    );
  } catch (error: unknown) {
    console.error('Error in trackEvent:', error);
  }
};

// Initialize analytics listener
export const initializeAnalytics = () => {
  // Listen for cookie consent updates
  window.addEventListener('cookieConsentUpdated', (event: Event) => {
    const customEvent = event as CustomEvent<{ analytics: boolean }>;
    const prefs = customEvent.detail;
    if (prefs.analytics) {
      // Consent just granted — caller can trigger a fresh trackPageView
    }
  });
};
