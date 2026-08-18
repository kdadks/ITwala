import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { studentUpdateSchema } from '@/utils/validation';
import { getCountryIsoCode, getStateIsoCode } from '@/utils/locationData';

function buildFallbackStudentId(countryCode: string, stateCode: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${countryCode}-${stateCode}-${year}-${month}-${random}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!['PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Verify admin session
    const supabase = createPagesServerClient({ req, res });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return res.status(401).json({
        error: 'Authentication required',
        requiresAuth: true
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.'
      });
    }

    // Verify the student exists
    const { data: existingStudent, error: existingError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', id)
      .single();

    if (existingError || !existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // DELETE: remove the student account and all related data
    if (req.method === 'DELETE') {
      // Remove enrollments first to satisfy the prevent_profile_deletion_with_enrollments trigger
      const { error: enrollError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('user_id', id);

      if (enrollError) {
        return res.status(500).json({ error: 'Failed to delete student enrollments' });
      }

      // Delete the auth user (cascades to profile and remaining related rows)
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

      if (deleteError) {
        return res.status(500).json({ error: 'Failed to delete student' });
      }

      return res.status(200).json({ message: 'Student deleted successfully' });
    }

    // PUT / PATCH: update student profile information
    const validated = studentUpdateSchema.parse(req.body);
    const {
      full_name,
      email,
      phone,
      date_of_birth,
      parent_name,
      highest_qualification,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
    } = validated;

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth || null;
    if (parent_name !== undefined) updateData.parent_name = parent_name || null;
    if (highest_qualification !== undefined) updateData.highest_qualification = highest_qualification || null;
    if (address_line1 !== undefined) updateData.address_line1 = address_line1 || null;
    if (address_line2 !== undefined) updateData.address_line2 = address_line2 || null;
    if (city !== undefined) updateData.city = city || null;
    if (state !== undefined) updateData.state = state || null;
    if (country !== undefined) updateData.country = country || null;
    if (pincode !== undefined) updateData.pincode = pincode || null;

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update student' });
    }

    // Generate student ID if missing and country/state are now populated
    const { data: updatedProfile, error: profileFetchError } = await supabaseAdmin
      .from('profiles')
      .select('student_id, country, state')
      .eq('id', id)
      .single();

    if (!profileFetchError && updatedProfile && !updatedProfile.student_id && updatedProfile.country && updatedProfile.state) {
      const countryCode = getCountryIsoCode(updatedProfile.country);
      const stateCode = getStateIsoCode(updatedProfile.state, countryCode);

      let studentId: string | null = null;
      try {
        const { data: studentIdResult, error: studentIdError } = await supabaseAdmin.rpc('generate_student_id', {
          country_code: countryCode,
          state_code: stateCode
        });

        if (studentIdError) {
          studentId = buildFallbackStudentId(countryCode, stateCode);
        } else {
          studentId = studentIdResult;
        }
      } catch (rpcError) {
        studentId = buildFallbackStudentId(countryCode, stateCode);
      }

      if (studentId) {
        await supabaseAdmin
          .from('profiles')
          .update({ student_id: studentId, updated_at: new Date().toISOString() })
          .eq('id', id);
      }
    }

    // Update email in auth if it changed (keeps it confirmed)
    if (email && email !== existingStudent.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email,
        email_confirm: true
      });

      if (emailError) {
        return res.status(400).json({ error: 'Failed to update email' });
      }

      await supabaseAdmin
        .from('profiles')
        .update({ email, updated_at: new Date().toISOString() })
        .eq('id', id);
    }

    const { data: finalProfile } = await supabaseAdmin
      .from('profiles')
      .select('student_id')
      .eq('id', id)
      .single();

    return res.status(200).json({
      message: 'Student updated successfully',
      student: {
        id,
        full_name,
        email: email || existingStudent.email,
        student_id: finalProfile?.student_id || null
      }
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      error: 'Failed to process request',
      ...(isDev && { details: error.message })
    });
  }
}
