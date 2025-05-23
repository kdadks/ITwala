require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function applyFixes() {
  try {
    console.log('Applying database fixes...');

    // Step 1: Fix course and profile relationships
    console.log('\n1. Fixing course-profile relationships...');
    const relationshipError = await supabase.from('courses').update({}).select().then(result => {
      if (result.error) return result.error;
      return null;
    });

    // Run raw SQL query
    await supabase.from('courses')
      .select()
      .then(async () => {
        await supabase.query(`
        ALTER TABLE courses
        DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

        ALTER TABLE courses
        ADD CONSTRAINT courses_instructor_id_fkey 
          FOREIGN KEY (instructor_id) 
          REFERENCES profiles(id) 
          ON DELETE SET NULL;

        CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
      `
    )});

    if (relationshipError) {
      throw new Error(`Error fixing relationships: ${relationshipError.message}`);
    }

    // Step 2: Fix enrollments table
    console.log('\n2. Fixing enrollments table...');
    const { error: enrollmentsError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP TABLE IF EXISTS enrollments;

        CREATE TABLE enrollments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
          enrolled_at TIMESTAMPTZ DEFAULT now(),
          status TEXT DEFAULT 'active',
          progress INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now(),
          UNIQUE(user_id, course_id)
        );
      `
    });

    if (enrollmentsError) {
      throw new Error(`Error fixing enrollments: ${enrollmentsError.message}`);
    }

    // Enable RLS on enrollments
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      throw new Error(`Error enabling RLS: ${rlsError.message}`);
    }

    // Step 3: Create updated course policies
    console.log('\n3. Setting up course policies...');
    const { error: coursePoliciesError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
        DROP POLICY IF EXISTS "Course creation policy" ON courses;
        DROP POLICY IF EXISTS "Course update policy" ON courses;
        DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
        DROP POLICY IF EXISTS "Instructors can manage their own courses" ON courses;

        -- View policy
        CREATE POLICY "Courses are viewable by everyone" 
          ON courses FOR SELECT 
          USING (
            CASE
              WHEN status = 'published' THEN true
              WHEN auth.uid() IS NOT NULL THEN EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND (profiles.role = 'admin' OR profiles.id = courses.instructor_id)
              )
              ELSE false
            END
          );

        -- Admin course policy
        CREATE POLICY "Admins can manage all courses"
          ON courses FOR ALL
          USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          ));

        -- Instructor course policy
        CREATE POLICY "Instructors can manage their own courses"
          ON courses FOR ALL
          USING (
            auth.uid() = instructor_id
            OR EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND profiles.role = 'instructor'
              AND instructor_id = profiles.id
            )
          );
      `
    });

    if (coursePoliciesError) {
      throw new Error(`Error setting up course policies: ${coursePoliciesError.message}`);
    }

    // Step 4: Create enrollment policies
    console.log('\n4. Setting up enrollment policies...');
    const { error: enrollmentPoliciesError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

        CREATE POLICY "Users can view their own enrollments" 
          ON enrollments FOR SELECT 
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own enrollments" 
          ON enrollments FOR INSERT 
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own enrollments" 
          ON enrollments FOR UPDATE 
          USING (auth.uid() = user_id);

        CREATE POLICY "Admins can view all enrollments" 
          ON enrollments FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          ));

        CREATE POLICY "Admins can manage all enrollments" 
          ON enrollments FOR ALL
          USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          ));
      `
    });

    if (enrollmentPoliciesError) {
      throw new Error(`Error setting up enrollment policies: ${enrollmentPoliciesError.message}`);
    }

    console.log('\nAll fixes applied successfully!');
  } catch (error) {
    console.error('Error applying fixes:', error.message);
    process.exit(1);
  }
}

applyFixes().then(() => process.exit(0));
