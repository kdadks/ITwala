import { supabase } from '@/lib/supabaseClient';

interface SiteSettings {
  id?: string;
  siteName: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  enrollmentsEnabled: boolean;
}

export async function setupSiteSettings() {
  try {
    // First check if we can get any settings
    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking site_settings:', fetchError);
      if (!fetchError.message.includes('does not exist')) {
        throw fetchError;
      }
      // Table doesn't exist - we'll let the migrations handle creation
      return;
    }

    // If we have no settings, insert default values
    if (!data) {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert([{
          site_name: 'ITwala Academy',
          contact_email: 'sales@it-wala.com',
          support_phone: '+91 7982303199',
          maintenance_mode: false,
          enrollments_enabled: true
        }]);

      if (insertError) {
        console.error('Error inserting default settings:', insertError);
        throw insertError;
      }
    }
  } catch (error: any) {
    console.error('Error in setupSiteSettings:', error);
    throw new Error(error.message || 'Failed to set up site settings');
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    // Transform snake_case to camelCase
    return {
      id: data.id,
      siteName: data.site_name,
      contactEmail: data.contact_email,
      supportPhone: data.support_phone,
      maintenanceMode: data.maintenance_mode,
      enrollmentsEnabled: data.enrollments_enabled
    };
  } catch (error: any) {
    console.error('Error in getSiteSettings:', error);
    throw new Error(error.message || 'Failed to fetch site settings');
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    // Transform camelCase to snake_case
    const { error } = await supabase
      .from('site_settings')
      .update({
        site_name: settings.siteName,
        contact_email: settings.contactEmail,
        support_phone: settings.supportPhone,
        maintenance_mode: settings.maintenanceMode,
        enrollments_enabled: settings.enrollmentsEnabled
      })
      .eq('id', settings.id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Error in updateSiteSettings:', error);
    throw new Error(error.message || 'Failed to update site settings');
  }
}
