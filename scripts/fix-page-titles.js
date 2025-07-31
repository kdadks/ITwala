const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to get proper page title based on URL
function getPageTitleFromUrl(url) {
  if (url.includes('/admin/analytics')) {
    return 'Analytics Dashboard - Admin';
  } else if (url.includes('/admin/revenue')) {
    return 'Revenue Dashboard - Admin';
  } else if (url.includes('/admin/users')) {
    return 'User Management - Admin';
  } else if (url.includes('/admin/content')) {
    return 'Content Management - Admin';
  } else if (url.includes('/admin')) {
    return 'Admin Dashboard - ITwala Academy';
  } else if (url.includes('/dashboard')) {
    return 'Dashboard - ITwala Academy';
  } else if (url.includes('/auth/login')) {
    return 'Login - ITwala Academy';
  } else if (url.includes('/auth/register')) {
    return 'Register - ITwala Academy';
  } else if (url.includes('/auth/forgot-password')) {
    return 'Forgot Password - ITwala Academy';
  } else if (url.includes('/courses/') && url.split('/').length > 2) {
    const coursePart = url.split('/')[2];
    const courseTitle = coursePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${courseTitle} Course - ITwala Academy`;
  } else if (url.includes('/courses')) {
    return 'AI Courses & ML Training - ITwala Academy';
  } else if (url.includes('/academy')) {
    return 'ITWala Academy - Premier AI Education & ML Training Platform';
  } else if (url.includes('/consulting')) {
    return 'ITWala Consulting - Expert IT Solutions & Digital Transformation';
  } else if (url.includes('/contact')) {
    return 'Contact ITwala Academy - AI Education Support & Consulting';
  } else if (url.includes('/ai-guide')) {
    return 'Complete AI Education Guide 2025 | Master AI & ML - ITwala';
  } else if (url === '/') {
    return 'ITWala Academy - #1 AI Education Platform | Master AI & ML';
  } else {
    // Generic fallback for other pages
    const pageName = url.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return pageName ? `${pageName} - ITwala Academy` : 'ITwala Academy';
  }
}

async function updateNullPageTitles() {
  console.log('🔧 Updating NULL page titles in database...\n');
  
  try {
    // Get all page views with NULL or empty titles
    const { data: pageViews, error: selectError } = await supabase
      .from('page_views')
      .select('id, page_url, page_title')
      .or('page_title.is.null,page_title.eq.');
      
    if (selectError) {
      console.error('❌ Error fetching page views:', selectError);
      return;
    }
    
    if (!pageViews || pageViews.length === 0) {
      console.log('✅ No page views with NULL titles found!');
      return;
    }
    
    console.log(`📊 Found ${pageViews.length} page views with NULL/empty titles`);
    console.log('🔄 Updating titles...\n');
    
    let updateCount = 0;
    let errorCount = 0;
    
    // Update each page view with proper title
    for (const pageView of pageViews) {
      const properTitle = getPageTitleFromUrl(pageView.page_url);
      
      const { error: updateError } = await supabase
        .from('page_views')
        .update({ page_title: properTitle })
        .eq('id', pageView.id);
        
      if (updateError) {
        console.error(`❌ Failed to update ${pageView.page_url}:`, updateError);
        errorCount++;
      } else {
        console.log(`✅ Updated: ${pageView.page_url} → "${properTitle}"`);
        updateCount++;
      }
    }
    
    console.log(`\n📈 Update Summary:`);
    console.log(`   ✅ Successfully updated: ${updateCount}`);
    console.log(`   ❌ Failed updates: ${errorCount}`);
    console.log(`   📊 Total processed: ${pageViews.length}`);
    
    if (updateCount > 0) {
      console.log('\n🎉 Page titles have been updated! The analytics dashboard should now show proper page titles instead of "Untitled Page".');
    }
    
  } catch (error) {
    console.error('❌ Error updating page titles:', error);
  }
}

updateNullPageTitles();
