import { supabase } from '../lib/supabaseClient';

/**
 * Creates the initial admin user if one does not already exist.
 *
 * Credentials are read from environment variables so that they are never
 * committed to source control.  Set the following in your .env.local file:
 *   ADMIN_EMAIL=<admin email>
 *   ADMIN_PASSWORD=<strong password>
 */
export const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      'setupAdmin: ADMIN_EMAIL and ADMIN_PASSWORD env vars are required. Skipping admin creation.'
    );
    return;
  }

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', adminEmail)
      .maybeSingle();

    if (!existingUser) {
      const { error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: { role: 'admin', full_name: 'Admin User' }
        }
      });
      if (error) throw error;
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
