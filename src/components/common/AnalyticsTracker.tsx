import { useEffect } from 'react';
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

const AnalyticsTracker: React.FC = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

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

        // Track page view
        const { error: pageViewError } = await supabase
          .from('page_views')
          .insert({
            user_id: user?.id || null,
            session_id: sessionId,
            page_url: pageUrl,
            page_title: pageTitle,
            referrer: referrer,
            user_agent: userAgent,
            device_type: deviceType,
            browser: browser,
            created_at: new Date().toISOString()
          });

        if (pageViewError) {
          console.error('Error tracking page view:', pageViewError);
        }

        // Update or create session
        const { data: existingSession } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

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
            console.error('Error updating session:', sessionError);
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
              created_at: new Date().toISOString()
            });

          if (sessionError) {
            console.error('Error creating session:', sessionError);
          }
        }

      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    // Track initial page view
    trackPageView();

    // Track page duration when user leaves
    let startTime = Date.now();
    
    const handleBeforeUnload = async () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const sessionId = generateSessionId();
      
      // Update page view with duration
      try {
        await supabase
          .from('page_views')
          .update({ duration_seconds: duration })
          .eq('session_id', sessionId)
          .eq('page_url', window.location.pathname)
          .order('created_at', { ascending: false })
          .limit(1);
      } catch (error) {
        console.error('Error updating page duration:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Call it when component unmounts too
    };
  }, [router.asPath, supabase, user?.id]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;