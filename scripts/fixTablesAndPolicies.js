require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

async function applyFixes() {
  try {
    console.log('Applying database fixes...');

    // Step 1: Fix relationships
    console.log('\n1. Fixing table relationships...');
    const { error: relationshipError } = await supabaseAdmin
      .from('courses')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .select();

    if (relationshipError && !relationshipError.message.includes('no rows')) {
      throw new Error(`Error accessing courses table: ${relationshipError.message}`);
    }

    // Step 2: Drop and recreate enrollments table
    console.log('\n2. Recreating enrollments table...');
    const { error: dropTableError } = await supabaseAdmin
      .from('enrollments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (dropTableError && !dropTableError.message.includes('does not exist')) {
      throw new Error(`Error dropping enrollments: ${dropTableError.message}`);
    }

    const { error: createTableError } = await supabaseAdmin
      .from('enrollments')
      .insert([{ 
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        course_id: '00000000-0000-0000-0000-000000000000',
        status: 'template',
        progress: 0
      }])
      .select();

    if (createTableError && !createTableError.message.includes('already exists')) {
      throw new Error(`Error creating enrollments: ${createTableError.message}`);
    }

    // Step 3: Enable RLS
    console.log('\n3. Configuring Row Level Security...');
    let { error: enableRLSError } = await supabaseAdmin
      .rpc('enable_rls', { table_name: 'courses' });

    if (enableRLSError && !enableRLSError.message.includes('already enabled')) {
      throw new Error(`Error enabling RLS on courses: ${enableRLSError.message}`);
    }

    enableRLSError = await supabaseAdmin
      .rpc('enable_rls', { table_name: 'enrollments' });

    if (enableRLSError && !enableRLSError.message.includes('already enabled')) {
      throw new Error(`Error enabling RLS on enrollments: ${enableRLSError.message}`);
    }

    // Step 4: Create policies
    console.log('\n4. Setting up access policies...');
    
    // Courses policies
    const coursePolicies = [
      {
        name: 'Courses are viewable by everyone',
        operation: 'SELECT',
        definition: `(
          CASE
            WHEN status = 'published' THEN true
            WHEN auth.uid() IS NOT NULL THEN EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND (profiles.role = 'admin' OR profiles.id = courses.instructor_id)
            )
            ELSE false
          END
        )`
      },
      {
        name: 'Admins can manage all courses',
        operation: 'ALL',
        definition: `EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )`
      },
      {
        name: 'Instructors can manage their own courses',
        operation: 'ALL',
        definition: `
          auth.uid() = instructor_id
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'instructor'
            AND instructor_id = profiles.id
          )
        `
      }
    ];

    for (const policy of coursePolicies) {
      const { error: policyError } = await supabaseAdmin
        .from('courses')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select()
        .policy(policy.name, policy.operation, policy.definition);

      if (policyError && !policyError.message.includes('already exists')) {
        throw new Error(`Error creating course policy ${policy.name}: ${policyError.message}`);
      }
    }

    // Enrollment policies
    const enrollmentPolicies = [
      {
        name: 'Users can view their own enrollments',
        operation: 'SELECT',
        definition: 'auth.uid() = user_id'
      },
      {
        name: 'Users can insert their own enrollments',
        operation: 'INSERT',
        definition: 'auth.uid() = user_id'
      },
      {
        name: 'Users can update their own enrollments',
        operation: 'UPDATE',
        definition: 'auth.uid() = user_id'
      },
      {
        name: 'Admins can manage all enrollments',
        operation: 'ALL',
        definition: `EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )`
      }
    ];

    for (const policy of enrollmentPolicies) {
      const { error: policyError } = await supabaseAdmin
        .from('enrollments')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select()
        .policy(policy.name, policy.operation, policy.definition);

      if (policyError && !policyError.message.includes('already exists')) {
        throw new Error(`Error creating enrollment policy ${policy.name}: ${policyError.message}`);
      }
    }

    console.log('\nAll fixes applied successfully!');
  } catch (error) {
    console.error('Error applying fixes:', error.message);
    process.exit(1);
  }
}

// Run the fixes
applyFixes().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
});
