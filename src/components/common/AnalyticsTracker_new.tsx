import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

// Simple function to generate session ID
const generateSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Simple device detection
const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

// Simple browser detection
const getBrowser = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  return 'Other';
};

// Get user's country using multiple fallback methods
const getCountryFromIP = async (): Promise<string> => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return 'Unknown';
  }
  
  // First try browser timezone
  try {
    if ('Intl' in window) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        const countryFromTz = getCountryFromTimezone(timezone);
        if (countryFromTz !== 'Unknown') {
          return countryFromTz;
        }
      }
    }
  } catch (error) {
    console.warn('Could not get timezone info:', error);
  }
  
  // Fallback to simple detection based on language/locale
  try {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1];
    if (countryCode) {
      return getCountryNameFromCode(countryCode) || 'Unknown';
    }
  } catch (error) {
    console.warn('Could not get country from locale:', error);
  }
  
  return 'Unknown';
};

// Helper function to get country from timezone
const getCountryFromTimezone = (timezone: string): string => {
  const timezoneCountryMap: { [key: string]: string } = {
    'America/New_York': 'United States',
    'America/Los_Angeles': 'United States',
    'America/Chicago': 'United States',
    'America/Denver': 'United States',
    'America/Toronto': 'Canada',
    'America/Vancouver': 'Canada',
    'Europe/London': 'United Kingdom',
    'Europe/Paris': 'France',
    'Europe/Berlin': 'Germany',
    'Europe/Rome': 'Italy',
    'Europe/Madrid': 'Spain',
    'Europe/Amsterdam': 'Netherlands',
    'Asia/Tokyo': 'Japan',
    'Asia/Shanghai': 'China',
    'Asia/Mumbai': 'India',
    'Asia/Kolkata': 'India',
    'Asia/Dubai': 'United Arab Emirates',
    'Australia/Sydney': 'Australia',
    'Australia/Melbourne': 'Australia',
  };
  
  return timezoneCountryMap[timezone] || 'Unknown';
};

// Helper function to get country name from code
const getCountryNameFromCode = (code: string): string => {
  const countryCodeMap: { [key: string]: string } = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'AE': 'United Arab Emirates',
    'AU': 'Australia',
    'BR': 'Brazil',
    'MX': 'Mexico',
  };
  
  return countryCodeMap[code.toUpperCase()] || 'Unknown';
};

const AnalyticsTracker: React.FC = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [userCountry, setUserCountry] = useState<string>('Unknown');

  // Fetch country on component mount
  useEffect(() => {
    getCountryFromIP().then(country => setUserCountry(country));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackPageView = async () => {
      try {
        const sessionId = generateSessionId();
        const pageUrl = window.location.pathname;
        const pageTitle = document.title;
        const referrer = document.referrer || null;
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType();
        const browser = getBrowser();

        // Track page view with country
        const { error: pageViewError } = await supabase
          .from('page_views')
          .insert({
            user_id: user?.id || null,
            session_id: sessionId,
            page_url: pageUrl,
            page_title: pageTitle,
            referrer: referrer,
            user_agent: userAgent,
            country: userCountry,
            device_type: deviceType,
            browser: browser,
            created_at: new Date().toISOString()
          });

        if (pageViewError) {
          console.warn('Page view tracking failed:', pageViewError);
        }

        // Handle session tracking with better error handling
        try {
          // Check if existing session exists
          const { data: existingSession, error: selectError } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

          if (selectError) {
            console.warn('Session tracking unavailable (table might not exist):', selectError);
            return;
          }

          if (existingSession) {
            // Update existing session
            const { error: sessionError } = await supabase
              .from('user_sessions')
              .update({
                last_page: pageUrl,
                total_pages: existingSession.total_pages + 1,
                updated_at: new Date().toISOString()
              })
              .eq('session_id', sessionId);

            if (sessionError) {
              console.warn('Session update failed:', sessionError);
            }
          } else {
            // Create new session
            const { error: sessionError } = await supabase
              .from('user_sessions')
              .insert({
                session_id: sessionId,
                user_id: user?.id || null,
                user_agent: userAgent,
                first_page: pageUrl,
                last_page: pageUrl,
                total_pages: 1,
                country: userCountry,
                device_type: deviceType,
                browser: browser,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (sessionError) {
              console.warn('Session creation failed:', sessionError);
            }
          }
        } catch (sessionTrackingError) {
          console.warn('Session tracking failed (non-critical):', sessionTrackingError);
        }

      } catch (error) {
        console.warn('Analytics tracking error:', error);
      }
    };

    trackPageView();

    // Track page duration when user leaves
    let startTime = Date.now();
    
    const handleBeforeUnload = async () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const sessionId = generateSessionId();
      
      try {
        await supabase
          .from('page_views')
          .update({ duration_seconds: duration })
          .eq('session_id', sessionId)
          .eq('page_url', window.location.pathname)
          .order('created_at', { ascending: false })
          .limit(1);
      } catch (error) {
        // Silently fail for duration tracking
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [router.asPath, supabase, user?.id, userCountry]);

  return null;
};

export default AnalyticsTracker;
