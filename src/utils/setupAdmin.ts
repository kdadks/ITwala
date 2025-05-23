import { supabase } from '../lib/supabaseClient';

export const createAdminUser = async () => {
  const adminEmail = 'admin@itwala.com';
  const adminPassword = 'Admin@123';

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select()
      .eq('email', adminEmail)
      .single();

    if (!existingUser) {
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            role: 'admin',
            full_name: 'Admin User'
          }
        }
      });

      if (error) throw error;
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
