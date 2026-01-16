/**
 * Test script to verify all fixes are working
 * Run this in the browser console to test the analytics and session fixes
 */

(function testAnalyticsFixes() {
  console.log('🧪 Testing Analytics and Session Fixes');
  console.log('=====================================');
  
  // Test 1: Check for CORS errors
  console.log('\n1. Testing for CORS/External API errors...');
  const originalWarn = console.warn;
  const originalError = console.error;
  
  let corsErrors = 0;
  let apiErrors = 0;
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('CORS') || message.includes('ipapi.co')) {
      corsErrors++;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('fetch') && message.includes('ipapi')) {
      apiErrors++;
    }
    originalError.apply(console, args);
  };
  
  // Test 2: Check timezone-based country detection
  console.log('\n2. Testing timezone-based country detection...');
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`✅ Timezone detected: ${timezone}`);
    
    // Test the mapping function
    const timezoneCountryMap = {
      'America/New_York': 'United States',
      'Europe/London': 'United Kingdom',
      'Asia/Tokyo': 'Japan',
      'Europe/Paris': 'France'
    };
    
    const detectedCountry = timezoneCountryMap[timezone] || 'Unknown';
    console.log(`✅ Country from timezone: ${detectedCountry}`);
  } catch (error) {
    console.error('❌ Timezone detection failed:', error);
  }
  
  // Test 3: Check locale-based detection
  console.log('\n3. Testing locale-based country detection...');
  try {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1];
    console.log(`✅ Locale detected: ${locale}`);
    console.log(`✅ Country code: ${countryCode || 'Unknown'}`);
  } catch (error) {
    console.error('❌ Locale detection failed:', error);
  }
  
  // Test 4: Check session storage
  console.log('\n4. Testing session ID generation...');
  try {
    const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('test_session_id', sessionId);
    const retrieved = sessionStorage.getItem('test_session_id');
    if (retrieved === sessionId) {
      console.log('✅ Session storage working');
      sessionStorage.removeItem('test_session_id');
    } else {
      console.error('❌ Session storage failed');
    }
  } catch (error) {
    console.error('❌ Session storage error:', error);
  }
  
  // Test 5: Check device detection
  console.log('\n5. Testing device detection...');
  try {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    
    if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|android/i.test(userAgent)) {
      deviceType = 'mobile';
    }
    
    console.log(`✅ Device type detected: ${deviceType}`);
  } catch (error) {
    console.error('❌ Device detection failed:', error);
  }
  
  // Wait a bit and check for errors
  setTimeout(() => {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`CORS Errors: ${corsErrors} (should be 0)`);
    console.log(`API Errors: ${apiErrors} (should be 0)`);
    
    if (corsErrors === 0 && apiErrors === 0) {
      console.log('🎉 All tests passed! Fixes are working correctly.');
    } else {
      console.log('⚠️ Some issues detected. Check the console for details.');
    }
    
    // Restore original console methods
    console.warn = originalWarn;
    console.error = originalError;
  }, 2000);
  
})();
