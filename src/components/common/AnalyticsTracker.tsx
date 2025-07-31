import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';

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

// Get user's country using multiple reliable methods
const getCountryFromIP = async (): Promise<string> => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return 'Unknown';
  }
  
  // Method 1: Try comprehensive timezone mapping first
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
  
  // Method 2: Try cloudflare's free IP geolocation API
  try {
    const response = await fetch('https://cloudflare.com/cdn-cgi/trace', {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });
    
    if (response.ok) {
      const data = await response.text();
      const locMatch = data.match(/loc=([A-Z]{2})/);
      if (locMatch && locMatch[1]) {
        const country = getCountryNameFromCode(locMatch[1]);
        if (country !== 'Unknown') {
          return country;
        }
      }
    }
  } catch (error) {
    console.warn('Cloudflare geolocation failed:', error);
  }
  
  // Method 3: Try ipapi.co (but with better error handling)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.country_name && data.country_name !== 'Unknown') {
        return data.country_name;
      }
    }
  } catch (error) {
    console.warn('ipapi.co geolocation failed:', error);
  }
  
  // Method 4: Enhanced locale detection
  try {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1];
    if (countryCode) {
      const country = getCountryNameFromCode(countryCode);
      if (country !== 'Unknown') {
        return country;
      }
    }
  } catch (error) {
    console.warn('Could not get country from locale:', error);
  }
  
  // Method 5: Try to infer from navigator.languages
  try {
    if (navigator.languages && navigator.languages.length > 0) {
      for (const lang of navigator.languages) {
        const parts = lang.split('-');
        if (parts.length > 1) {
          const country = getCountryNameFromCode(parts[1]);
          if (country !== 'Unknown') {
            return country;
          }
        }
      }
    }
  } catch (error) {
    console.warn('Could not get country from languages:', error);
  }
  
  return 'Unknown';
};

// Helper function to get country from timezone (comprehensive mapping)
const getCountryFromTimezone = (timezone: string): string => {
  const timezoneCountryMap: { [key: string]: string } = {
    // North America
    'America/New_York': 'United States',
    'America/Los_Angeles': 'United States', 
    'America/Chicago': 'United States',
    'America/Denver': 'United States',
    'America/Phoenix': 'United States',
    'America/Anchorage': 'United States',
    'America/Toronto': 'Canada',
    'America/Vancouver': 'Canada',
    'America/Montreal': 'Canada',
    'America/Halifax': 'Canada',
    'America/Mexico_City': 'Mexico',
    'America/Tijuana': 'Mexico',
    
    // South America
    'America/Sao_Paulo': 'Brazil',
    'America/Buenos_Aires': 'Argentina',
    'America/Santiago': 'Chile',
    'America/Lima': 'Peru',
    'America/Bogota': 'Colombia',
    'America/Caracas': 'Venezuela',
    
    // Europe
    'Europe/London': 'United Kingdom',
    'Europe/Paris': 'France',
    'Europe/Berlin': 'Germany',
    'Europe/Rome': 'Italy',
    'Europe/Madrid': 'Spain',
    'Europe/Amsterdam': 'Netherlands',
    'Europe/Brussels': 'Belgium',
    'Europe/Vienna': 'Austria',
    'Europe/Zurich': 'Switzerland',
    'Europe/Stockholm': 'Sweden',
    'Europe/Oslo': 'Norway',
    'Europe/Copenhagen': 'Denmark',
    'Europe/Helsinki': 'Finland',
    'Europe/Warsaw': 'Poland',
    'Europe/Prague': 'Czech Republic',
    'Europe/Budapest': 'Hungary',
    'Europe/Bucharest': 'Romania',
    'Europe/Sofia': 'Bulgaria',
    'Europe/Athens': 'Greece',
    'Europe/Istanbul': 'Turkey',
    'Europe/Moscow': 'Russia',
    'Europe/Kiev': 'Ukraine',
    'Europe/Dublin': 'Ireland',
    'Europe/Lisbon': 'Portugal',
    
    // Asia
    'Asia/Tokyo': 'Japan',
    'Asia/Shanghai': 'China',
    'Asia/Beijing': 'China',
    'Asia/Hong_Kong': 'Hong Kong',
    'Asia/Singapore': 'Singapore',
    'Asia/Seoul': 'South Korea',
    'Asia/Taipei': 'Taiwan',
    'Asia/Bangkok': 'Thailand',
    'Asia/Jakarta': 'Indonesia',
    'Asia/Manila': 'Philippines',
    'Asia/Kuala_Lumpur': 'Malaysia',
    'Asia/Ho_Chi_Minh': 'Vietnam',
    'Asia/Mumbai': 'India',
    'Asia/Kolkata': 'India',
    'Asia/Delhi': 'India',
    'Asia/Karachi': 'Pakistan',
    'Asia/Dhaka': 'Bangladesh',
    'Asia/Dubai': 'United Arab Emirates',
    'Asia/Riyadh': 'Saudi Arabia',
    'Asia/Tehran': 'Iran',
    'Asia/Baghdad': 'Iraq',
    'Asia/Kuwait': 'Kuwait',
    'Asia/Qatar': 'Qatar',
    'Asia/Bahrain': 'Bahrain',
    'Asia/Muscat': 'Oman',
    'Asia/Tashkent': 'Uzbekistan',
    'Asia/Almaty': 'Kazakhstan',
    
    // Africa
    'Africa/Cairo': 'Egypt',
    'Africa/Lagos': 'Nigeria',
    'Africa/Johannesburg': 'South Africa',
    'Africa/Nairobi': 'Kenya',
    'Africa/Casablanca': 'Morocco',
    'Africa/Tunis': 'Tunisia',
    'Africa/Algiers': 'Algeria',
    'Africa/Accra': 'Ghana',
    'Africa/Addis_Ababa': 'Ethiopia',
    
    // Oceania
    'Australia/Sydney': 'Australia',
    'Australia/Melbourne': 'Australia',
    'Australia/Perth': 'Australia',
    'Australia/Brisbane': 'Australia',
    'Australia/Adelaide': 'Australia',
    'Pacific/Auckland': 'New Zealand',
    'Pacific/Fiji': 'Fiji',
    
    // Other
    'Atlantic/Reykjavik': 'Iceland',
    'Pacific/Honolulu': 'United States'
  };
  
  return timezoneCountryMap[timezone] || 'Unknown';
};

// Helper function to get country name from code (comprehensive mapping)
const getCountryNameFromCode = (code: string): string => {
  const countryCodeMap: { [key: string]: string } = {
    // Major countries
    'US': 'United States',
    'CA': 'Canada', 
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'GR': 'Greece',
    'TR': 'Turkey',
    'RU': 'Russia',
    'UA': 'Ukraine',
    'IE': 'Ireland',
    'PT': 'Portugal',
    
    // Asia
    'JP': 'Japan',
    'CN': 'China',
    'KR': 'South Korea',
    'TW': 'Taiwan',
    'HK': 'Hong Kong',
    'SG': 'Singapore',
    'TH': 'Thailand',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'MY': 'Malaysia',
    'VN': 'Vietnam',
    'IN': 'India',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'OM': 'Oman',
    'UZ': 'Uzbekistan',
    'KZ': 'Kazakhstan',
    'IL': 'Israel',
    'JO': 'Jordan',
    'LB': 'Lebanon',
    'SY': 'Syria',
    
    // Africa
    'EG': 'Egypt',
    'NG': 'Nigeria',
    'ZA': 'South Africa',
    'KE': 'Kenya',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'DZ': 'Algeria',
    'GH': 'Ghana',
    'ET': 'Ethiopia',
    'TZ': 'Tanzania',
    'UG': 'Uganda',
    'ZW': 'Zimbabwe',
    'ZM': 'Zambia',
    'BW': 'Botswana',
    'MW': 'Malawi',
    'MZ': 'Mozambique',
    'AO': 'Angola',
    'CM': 'Cameroon',
    'CI': 'Ivory Coast',
    'SN': 'Senegal',
    
    // Americas
    'BR': 'Brazil',
    'AR': 'Argentina',
    'CL': 'Chile',
    'PE': 'Peru',
    'CO': 'Colombia',
    'VE': 'Venezuela',
    'EC': 'Ecuador',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'MX': 'Mexico',
    'GT': 'Guatemala',
    'CR': 'Costa Rica',
    'PA': 'Panama',
    'HN': 'Honduras',
    'NI': 'Nicaragua',
    'SV': 'El Salvador',
    'BZ': 'Belize',
    'JM': 'Jamaica',
    'CU': 'Cuba',
    'DO': 'Dominican Republic',
    'HT': 'Haiti',
    'TT': 'Trinidad and Tobago',
    
    // Oceania
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'FJ': 'Fiji',
    'PG': 'Papua New Guinea',
    'NC': 'New Caledonia',
    'VU': 'Vanuatu',
    'SB': 'Solomon Islands',
    
    // Others
    'IS': 'Iceland',
    'GL': 'Greenland',
    'FO': 'Faroe Islands'
  };
  
  return countryCodeMap[code.toUpperCase()] || 'Unknown';
};

const AnalyticsTracker: React.FC = () => {
  const router = useRouter();
  const user = useUser();
  const [userCountry, setUserCountry] = useState<string>('Unknown');
  const [lastTrackedPage, setLastTrackedPage] = useState<string>('');

  // Fetch country on component mount
  useEffect(() => {
    getCountryFromIP().then(country => setUserCountry(country));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackPageView = async () => {
      try {
        const pageUrl = window.location.pathname;
        
        // Prevent duplicate tracking of the same page
        if (pageUrl === lastTrackedPage) {
          return;
        }
        setLastTrackedPage(pageUrl);

        const sessionId = generateSessionId();
        const pageTitle = document.title;
        const referrer = document.referrer || null;
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType();
        const browser = getBrowser();

        // Track page view with country
        try {
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
            if (pageViewError.code === '42501') {
              console.warn('⚠️ Analytics tracking disabled due to database permissions.');
              console.warn('Please run: supabase/fix-analytics-rls-manual.sql in Supabase Dashboard');
              return; // Skip session tracking too
            } else {
              console.warn('Page view tracking failed (non-critical):', pageViewError);
            }
          }
        } catch (pageViewTrackingError) {
          console.warn('Page view tracking error (non-critical):', pageViewTrackingError);
          // Continue with session tracking even if page view fails
        }

        // Handle session tracking with upsert to avoid duplicates
        try {
          // Use upsert to handle session creation/update in one operation
          const sessionData: any = {
            session_id: sessionId,
            user_id: user?.id || null,
            user_agent: userAgent,
            first_page: pageUrl,
            last_page: pageUrl,
            total_pages: 1,
            total_duration_seconds: 0,
            is_bounce: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // First try to update existing session
          const { data: existingSession, error: selectError } = await supabase
            .from('user_sessions')
            .select('total_pages')
            .eq('session_id', sessionId)
            .maybeSingle();

          if (!selectError && existingSession) {
            // Session exists, update it
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
            // Session doesn't exist, try to create it
            const { error: sessionError } = await supabase
              .from('user_sessions')
              .insert(sessionData)
              .select()
              .single();

            if (sessionError) {
              // If insert fails due to duplicate (race condition), try update instead
              if (sessionError.code === '23505') {
                console.log('Session already exists (race condition), updating instead...');
                const { error: fallbackError } = await supabase
                  .from('user_sessions')
                  .update({
                    last_page: pageUrl,
                    total_pages: 1,
                    updated_at: new Date().toISOString()
                  })
                  .eq('session_id', sessionId);

                if (fallbackError) {
                  console.warn('Session fallback update failed:', fallbackError);
                }
              } else if (sessionError.code === '42501') {
                console.warn('⚠️ Session tracking blocked by database permissions.');
                console.warn('Please run: supabase/fix-analytics-rls-manual.sql in Supabase Dashboard');
              } else {
                console.warn('Session creation failed (non-critical):', sessionError);
              }
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
