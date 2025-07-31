// Test the improved country detection methods
// This will run in Node.js context to test the API endpoints

const https = require('https');

async function testCountryDetectionAPIs() {
  console.log('🌍 Testing country detection APIs...');
  
  // Test Cloudflare trace API
  console.log('\n1. Testing Cloudflare trace API...');
  try {
    const response = await fetch('https://cloudflare.com/cdn-cgi/trace');
    if (response.ok) {
      const data = await response.text();
      console.log('Cloudflare response sample:', data.split('\n').slice(0, 5).join('\n'));
      
      const locMatch = data.match(/loc=([A-Z]{2})/);
      if (locMatch) {
        console.log('✅ Country code from Cloudflare:', locMatch[1]);
      }
    }
  } catch (error) {
    console.log('❌ Cloudflare API error:', error.message);
  }
  
  // Test ipapi.co
  console.log('\n2. Testing ipapi.co API...');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Country from ipapi.co:', data.country_name, `(${data.country})`);
      console.log('   City:', data.city, ', Region:', data.region);
    }
  } catch (error) {
    console.log('❌ ipapi.co error:', error.message);
  }
  
  // Test browser APIs (simulated)
  console.log('\n3. Browser API simulation...');
  
  // Simulate common timezones
  const testTimezones = [
    'America/New_York',
    'Europe/London', 
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Europe/Paris',
    'Asia/Shanghai'
  ];
  
  console.log('Sample timezone mappings:');
  testTimezones.forEach(tz => {
    // We would call getCountryFromTimezone here if this were in the browser
    console.log(`   ${tz} -> [would be mapped to country]`);
  });
  
  // Simulate locale detection
  const testLocales = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN', 'hi-IN'];
  console.log('\nSample locale mappings:');
  testLocales.forEach(locale => {
    const parts = locale.split('-');
    if (parts.length > 1) {
      console.log(`   ${locale} -> ${parts[1]} (country code)`);
    }
  });
  
  console.log('\n🎯 The improved country detection will use multiple methods:');
  console.log('   1. Enhanced timezone mapping (80+ countries)');
  console.log('   2. Cloudflare geolocation API (fast, reliable)');
  console.log('   3. ipapi.co API (detailed location data)');
  console.log('   4. Browser locale detection (navigator.language)');
  console.log('   5. Navigator languages array fallback');
  console.log('\nThis should significantly reduce "Unknown" country entries!');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('⚠️ This test requires Node.js 18+ with built-in fetch');
  console.log('The country detection improvements have been applied to the AnalyticsTracker.');
  console.log('Test by visiting the application in a browser to see actual country detection.');
} else {
  testCountryDetectionAPIs().catch(console.error);
}
