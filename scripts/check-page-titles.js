const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPageTitles() {
  console.log('🔍 Checking page titles in page_views table...\n');
  
  try {
    // Get recent page views
    const { data: pageViews, error } = await supabase
      .from('page_views')
      .select('page_url, page_title, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('❌ Error fetching page views:', error);
      return;
    }
    
    if (!pageViews || pageViews.length === 0) {
      console.log('⚠️ No page views found in the database');
      return;
    }
    
    console.log(`📊 Found ${pageViews.length} recent page views:\n`);
    
    let emptyTitleCount = 0;
    let nullTitleCount = 0;
    
    pageViews.forEach((view, index) => {
      const hasTitle = view.page_title && view.page_title.trim() !== '';
      const status = hasTitle ? '✅' : '❌';
      
      if (!view.page_title) {
        nullTitleCount++;
      } else if (view.page_title.trim() === '') {
        emptyTitleCount++;
      }
      
      console.log(`${index + 1}. ${status} URL: ${view.page_url}`);
      console.log(`   Title: "${view.page_title || 'NULL'}"`);
      console.log(`   Date: ${new Date(view.created_at).toLocaleString()}\n`);
    });
    
    console.log('📈 Summary:');
    console.log(`   Total entries: ${pageViews.length}`);
    console.log(`   NULL titles: ${nullTitleCount}`);
    console.log(`   Empty titles: ${emptyTitleCount}`);
    console.log(`   Valid titles: ${pageViews.length - nullTitleCount - emptyTitleCount}`);
    
    // Check unique URLs and their titles
    console.log('\n🌐 Unique URLs and their titles:');
    const urlTitleMap = {};
    pageViews.forEach(view => {
      if (!urlTitleMap[view.page_url]) {
        urlTitleMap[view.page_url] = view.page_title;
      }
    });
    
    Object.entries(urlTitleMap).forEach(([url, title]) => {
      const status = title && title.trim() !== '' ? '✅' : '❌';
      console.log(`${status} ${url} → "${title || 'NO TITLE'}"`);
    });
    
  } catch (error) {
    console.error('❌ Error checking page titles:', error);
  }
}

checkPageTitles();
