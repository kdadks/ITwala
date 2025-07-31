/**
 * Client-side Session Conflict Resolver
 * 
 * Add this to your browser console to manually clear session conflicts:
 * 
 * 1. Open Developer Tools (F12)
 * 2. Go to Console tab
 * 3. Paste this entire script
 * 4. Press Enter
 * 5. Refresh the page
 */

(function clearSupabaseSessionConflicts() {
  console.log('🔧 ITWala Academy Session Conflict Resolver');
  console.log('🧹 Clearing all auth-related storage...');
  
  // Clear localStorage
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || 
    key.includes('auth') || 
    key.includes('sb-') ||
    key.includes('token')
  );
  
  console.log('📋 Found auth keys:', authKeys);
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`❌ Removed: ${key}`);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('❌ Cleared sessionStorage');
  
  // Clear cookies (if any)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  console.log('❌ Cleared cookies');
  
  console.log('✅ Session conflicts cleared!');
  console.log('🔄 Please refresh the page to continue');
  
  // Optional: Auto-refresh after 2 seconds
  setTimeout(() => {
    if (confirm('Session conflicts cleared. Refresh the page now?')) {
      location.reload();
    }
  }, 2000);
})();
