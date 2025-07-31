const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

// Improved country detection functions (server-side version)
async function detectCountryFromAPI() {
  try {
    // Try Cloudflare first (most reliable)
    const cfResponse = await fetch('https://cloudflare.com/cdn-cgi/trace');
    if (cfResponse.ok) {
      const data = await cfResponse.text();
      const locMatch = data.match(/loc=([A-Z]{2})/);
      if (locMatch && locMatch[1]) {
        const country = getCountryNameFromCode(locMatch[1]);
        if (country !== 'Unknown') {
          return country;
        }
      }
    }
  } catch (error) {
    console.warn('Cloudflare detection failed:', error.message);
  }

  try {
    // Fallback to ipapi.co
    const response = await fetch('https://ipapi.co/json/', {
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.country_name && data.country_name !== 'Unknown') {
        return data.country_name;
      }
    }
  } catch (error) {
    console.warn('ipapi.co detection failed:', error.message);
  }

  return 'Unknown';
}

function getCountryNameFromCode(code) {
  const countryCodeMap = {
    'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'FR': 'France',
    'DE': 'Germany', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
    'BE': 'Belgium', 'AT': 'Austria', 'CH': 'Switzerland', 'SE': 'Sweden',
    'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland',
    'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania', 'BG': 'Bulgaria',
    'GR': 'Greece', 'TR': 'Turkey', 'RU': 'Russia', 'UA': 'Ukraine',
    'IE': 'Ireland', 'PT': 'Portugal', 'JP': 'Japan', 'CN': 'China',
    'KR': 'South Korea', 'TW': 'Taiwan', 'HK': 'Hong Kong', 'SG': 'Singapore',
    'TH': 'Thailand', 'ID': 'Indonesia', 'PH': 'Philippines', 'MY': 'Malaysia',
    'VN': 'Vietnam', 'IN': 'India', 'PK': 'Pakistan', 'BD': 'Bangladesh',
    'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'IR': 'Iran',
    'IQ': 'Iraq', 'KW': 'Kuwait', 'QA': 'Qatar', 'BH': 'Bahrain',
    'OM': 'Oman', 'IL': 'Israel', 'JO': 'Jordan', 'LB': 'Lebanon',
    'EG': 'Egypt', 'NG': 'Nigeria', 'ZA': 'South Africa', 'KE': 'Kenya',
    'MA': 'Morocco', 'TN': 'Tunisia', 'DZ': 'Algeria', 'GH': 'Ghana',
    'ET': 'Ethiopia', 'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile',
    'PE': 'Peru', 'CO': 'Colombia', 'VE': 'Venezuela', 'MX': 'Mexico',
    'AU': 'Australia', 'NZ': 'New Zealand', 'FJ': 'Fiji', 'IS': 'Iceland'
  };
  
  return countryCodeMap[code.toUpperCase()] || 'Unknown';
}

async function updateUnknownCountries() {
  try {
    console.log('🔄 Updating Unknown country entries...');
    
    // Detect current server location
    const detectedCountry = await detectCountryFromAPI();
    console.log(`🌍 Detected server country: ${detectedCountry}`);
    
    if (detectedCountry === 'Unknown') {
      console.log('⚠️ Could not detect country from server. Skipping update.');
      return;
    }
    
    // Get recent entries with Unknown country (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: unknownPageViews, error: pageViewError } = await supabase
      .from('page_views')
      .select('id')
      .eq('country', 'Unknown')
      .gte('created_at', twoHoursAgo);
    
    if (pageViewError) {
      console.log('❌ Error fetching unknown page views:', pageViewError);
      return;
    }
    
    console.log(`📊 Found ${unknownPageViews.length} page views with Unknown country`);
    
    // Update page views in batches
    if (unknownPageViews.length > 0) {
      const { error: updateError } = await supabase
        .from('page_views')
        .update({ country: detectedCountry })
        .eq('country', 'Unknown')
        .gte('created_at', twoHoursAgo);
      
      if (updateError) {
        console.log('❌ Error updating page views:', updateError);
      } else {
        console.log(`✅ Updated ${unknownPageViews.length} page view entries to ${detectedCountry}`);
      }
    }
    
    // Also check and update user sessions if they have country field
    try {
      const { data: unknownSessions, error: sessionError } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('country', 'Unknown')
        .gte('created_at', twoHoursAgo);
      
      if (!sessionError && unknownSessions && unknownSessions.length > 0) {
        const { error: updateSessionError } = await supabase
          .from('user_sessions')
          .update({ country: detectedCountry })
          .eq('country', 'Unknown')
          .gte('created_at', twoHoursAgo);
        
        if (!updateSessionError) {
          console.log(`✅ Updated ${unknownSessions.length} session entries to ${detectedCountry}`);
        }
      }
    } catch (e) {
      // user_sessions might not have country column, which is ok
      console.log('ℹ️ user_sessions table might not have country column (ok)');
    }
    
    console.log('\n🎉 Migration complete! Re-run analytics check to see results.');
    
  } catch (error) {
    console.error('❌ Error updating countries:', error);
  }
}

updateUnknownCountries();
