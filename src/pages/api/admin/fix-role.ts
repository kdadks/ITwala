import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // First, get the admin user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    const adminUser = users?.find((user: { email: string }) => user.email === 'admin@itwala.com');
    
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Ensure admin profile exists with correct role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) throw profileError;

    // Update user metadata to include admin role
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: { role: 'admin' }
      }
    );

    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Admin role fixed successfully' });
  } catch (error: any) {
    console.error('Error fixing admin role:', error);
    return res.status(500).json({ 
      message: 'Error fixing admin role',
      error: error.message
    });
  }
}
