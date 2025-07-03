const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categories from the website based on the course data
const websiteCategories = [
  {
    name: 'Prompt Engineering',
    slug: 'prompt-engineering',
    description: 'Master the art of crafting effective prompts for AI models'
  },
  {
    name: 'Agentic AI',
    slug: 'agentic-ai',
    description: 'Build autonomous AI agents that can perform complex tasks'
  },
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Explore machine learning, deep learning, and AI applications'
  },
  {
    name: 'Product Management',
    slug: 'product-management',
    description: 'Learn to define, build, and launch successful IT products'
  },
  {
    name: 'Software Development',
    slug: 'software-development',
    description: 'Master programming languages and development practices'
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Learn algorithms and techniques for building intelligent systems'
  }
];

async function analyzeCategories() {
  console.log('🔍 Analyzing Categories...\n');
  
  try {
    // 1. Check current categories in database
    console.log('1. Checking current categories in database:');
    const { data: dbCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message);
      return;
    }
    
    console.log(`   Found ${dbCategories?.length || 0} categories in database:`);
    dbCategories?.forEach(cat => console.log(`   - ${cat.name} (ID: ${cat.id})`));
    
    // 2. Check categories from website courses
    console.log('\n2. Categories used in website courses:');
    websiteCategories.forEach(cat => console.log(`   - ${cat.name}`));
    
    // 3. Compare and find mismatches
    console.log('\n3. Category Analysis:');
    const dbCategoryNames = dbCategories?.map(cat => cat.name) || [];
    const websiteCategoryNames = websiteCategories.map(cat => cat.name);
    const missingInDb = websiteCategories.filter(cat => !dbCategoryNames.includes(cat.name));
    const extraInDb = dbCategoryNames.filter(cat => !websiteCategoryNames.includes(cat));
    
    if (missingInDb.length > 0) {
      console.log('   📋 Categories missing from database:');
      missingInDb.forEach(cat => console.log(`   - ${cat.name}`));
    }
    
    if (extraInDb.length > 0) {
      console.log('   🗑️  Categories in database but not used in website:');
      extraInDb.forEach(cat => console.log(`   - ${cat}`));
    }
    
    if (missingInDb.length === 0 && extraInDb.length === 0) {
      console.log('   ✅ Categories are perfectly synchronized!');
    }
    
    // 4. Check admin access
    console.log('\n4. Testing admin access to categories:');
    const { data: testInsert, error: insertError } = await supabase
      .from('categories')
      .insert([{
        name: 'TEST_CATEGORY_DELETE_ME',
        slug: 'test-category-delete-me',
        description: 'Test category for admin access verification'
      }])
      .select();
    
    if (insertError) {
      console.error('   ❌ Admin cannot insert categories:', insertError.message);
      console.log('   💡 This indicates admin access policies need to be applied');
    } else {
      console.log('   ✅ Admin can insert categories');
      
      // Clean up test category
      await supabase
        .from('categories')
        .delete()
        .eq('name', 'TEST_CATEGORY_DELETE_ME');
    }
    
    return { missingInDb, extraInDb, hasAccessIssues: !!insertError };
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  }
}

async function fixCategories() {
  console.log('\n🔧 Fixing Categories...\n');
  
  try {
    // 1. Apply admin access policies
    console.log('1. Applying admin access policies...');
    
    const adminPoliciesSQL = `
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
      DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
      DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
      DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;
      
      -- Create public read access
      CREATE POLICY "Anyone can view categories" ON categories
          FOR SELECT USING (true);
      
      -- Create admin policies for categories
      CREATE POLICY "Only admins can insert categories" ON categories
          FOR INSERT WITH CHECK (
              EXISTS (
                  SELECT 1 FROM profiles 
                  WHERE profiles.id = auth.uid() 
                  AND profiles.role = 'admin'
              )
          );
      
      CREATE POLICY "Only admins can update categories" ON categories
          FOR UPDATE USING (
              EXISTS (
                  SELECT 1 FROM profiles 
                  WHERE profiles.id = auth.uid() 
                  AND profiles.role = 'admin'
              )
          );
      
      CREATE POLICY "Only admins can delete categories" ON categories
          FOR DELETE USING (
              EXISTS (
                  SELECT 1 FROM profiles 
                  WHERE profiles.id = auth.uid() 
                  AND profiles.role = 'admin'
              )
          );
    `;
    
    const { error: policyError } = await supabase.rpc('exec_sql', { sql: adminPoliciesSQL });
    
    if (policyError) {
      console.error('   ❌ Error applying admin policies:', policyError.message);
      console.log('   💡 Please run the SQL manually in Supabase dashboard');
    } else {
      console.log('   ✅ Admin access policies applied successfully');
    }
    
    // 2. Sync categories
    console.log('\n2. Synchronizing categories with website data...');
    
    // Get current categories
    const { data: currentCategories } = await supabase
      .from('categories')
      .select('*');
    
    const currentCategoryNames = currentCategories?.map(cat => cat.name) || [];
    
    // Add missing categories
    const missingCategories = websiteCategories.filter(cat => !currentCategoryNames.includes(cat.name));
    
    if (missingCategories.length > 0) {
      console.log('   📋 Adding missing categories:');
      
      for (const category of missingCategories) {
        const { error: insertError } = await supabase
          .from('categories')
          .insert([{
            name: category.name,
            slug: category.slug,
            description: category.description
          }]);
        
        if (insertError) {
          console.error(`   ❌ Error adding "${category.name}":`, insertError.message);
        } else {
          console.log(`   ✅ Added "${category.name}"`);
        }
      }
    } else {
      console.log('   ✅ All website categories already exist in database');
    }
    
    // 3. Verify final state
    console.log('\n3. Final verification...');
    const { data: finalCategories } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    console.log('   📋 Current categories in database:');
    finalCategories?.forEach(cat => console.log(`   - ${cat.name} (ID: ${cat.id})`));
    
    console.log('\n✅ Categories synchronization completed!');
    
  } catch (error) {
    console.error('❌ Error during fix:', error.message);
  }
}

async function main() {
  console.log('🚀 Category Analysis and Fix Tool\n');
  
  const analysis = await analyzeCategories();
  
  if (analysis && (analysis.missingInDb.length > 0 || analysis.hasAccessIssues)) {
    console.log('\n❓ Issues found. Do you want to fix them? (This will modify the database)');
    console.log('   - Add missing categories to database');
    console.log('   - Apply admin access policies');
    console.log('\nTo proceed with fixes, run: node scripts/analyze-and-fix-categories.js --fix');
    
    if (process.argv.includes('--fix')) {
      await fixCategories();
    }
  } else {
    console.log('\n✅ No issues found! Categories are properly synchronized.');
  }
}

main().catch(console.error);