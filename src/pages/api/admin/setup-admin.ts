import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // 1. Sign up admin user if not exists
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      options: {
        data: {
          role: 'admin',
          full_name: 'Admin User'
        }
      }
    });

    if (signUpError && !signUpError.message.includes('User already registered')) {
      throw signUpError;
    }

    // 2. Try to sign in as admin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) {
      throw signInError;
    }

    // 3. Create or update admin profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return res.status(200).json({
      message: 'Admin setup completed successfully',
      profile: profile,
      user: signInData.user
    });

  } catch (error: any) {
    console.error('Admin setup error:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
