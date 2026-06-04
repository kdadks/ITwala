import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/utils/certificateGenerator';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface GenerateRequest {
  // Single or bulk — array of one or many
  entries: Array<{
    studentId: string;
    courseId: string;
    enrollmentId?: string;
    completionDate: string; // ISO date string
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin via service role — we trust the caller is authenticated admin
  // (the admin page guards this; for extra safety we verify the session header)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  const token = authHeader.slice(7);

  const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Check admin role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { entries }: GenerateRequest = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: 'entries array is required' });
  }

  // Load both logos once — reused across all certificates in this request
  let logoBase64: string | undefined;
  try {
    logoBase64 = fs.readFileSync(
      path.join(process.cwd(), 'public', 'images', 'IT-WALA-logo-96x96.png')
    ).toString('base64');
  } catch { /* fallback to drawn placeholder */ }

  let kdadksBase64: string | undefined;
  try {
    kdadksBase64 = fs.readFileSync(
      path.join(process.cwd(), 'public', 'images', 'kdadks-logo.png')
    ).toString('base64');
  } catch { /* file not present yet — footer still renders without it */ }

  const results: Array<{
    studentId: string;
    courseId: string;
    success: boolean;
    certificateNumber?: string;
    downloadUrl?: string;
    error?: string;
  }> = [];

  for (const entry of entries) {
    const { studentId, courseId, enrollmentId, completionDate } = entry;

    try {
      // Fetch student and course details
      const [studentRes, courseRes] = await Promise.all([
        supabaseAdmin.from('profiles').select('full_name').eq('id', studentId).single(),
        supabaseAdmin.from('courses').select('title').eq('id', courseId).single(),
      ]);

      if (studentRes.error || !studentRes.data) {
        throw new Error(`Student not found: ${studentId}`);
      }
      if (courseRes.error || !courseRes.data) {
        throw new Error(`Course not found: ${courseId}`);
      }

      // Check if a certificate already exists — if so, update it
      const { data: existing } = await supabaseAdmin
        .from('certificates')
        .select('id, certificate_number, storage_path')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .maybeSingle();

      const certNumber = existing?.certificate_number ?? await generateCertNumber(supabaseAdmin, completionDate);

      // Generate PDF
      const pdfBytes = await generateCertificatePDF(
        {
          studentName: studentRes.data.full_name,
          courseName: courseRes.data.title,
          completionDate,
          certificateNumber: certNumber,
        },
        logoBase64,
        kdadksBase64
      );

      const storagePath = `${studentId}/${courseId}/${certNumber}.pdf`;

      // Upload to Supabase Storage (upsert)
      const { error: uploadErr } = await supabaseAdmin.storage
        .from('certificates')
        .upload(storagePath, Buffer.from(pdfBytes), {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadErr) {
        throw new Error(`Storage upload failed: ${uploadErr.message}`);
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('certificates')
        .getPublicUrl(storagePath);

      const downloadUrl = urlData.publicUrl;

      // Upsert certificate record
      const certRecord = {
        student_id: studentId,
        course_id: courseId,
        enrollment_id: enrollmentId ?? null,
        certificate_number: certNumber,
        completion_date: completionDate,
        issued_by: user.id,
        storage_path: storagePath,
        download_url: downloadUrl,
        issued_at: new Date().toISOString(),
      };

      if (existing) {
        await supabaseAdmin
          .from('certificates')
          .update(certRecord)
          .eq('id', existing.id);
      } else {
        await supabaseAdmin.from('certificates').insert([certRecord]);
      }

      results.push({ studentId, courseId, success: true, certificateNumber: certNumber, downloadUrl });
    } catch (err: any) {
      results.push({ studentId, courseId, success: false, error: err.message });
    }
  }

  const failed = results.filter((r) => !r.success);
  const status = failed.length === 0 ? 200 : failed.length === results.length ? 500 : 207;
  return res.status(status).json({ results });
}

async function generateCertNumber(supabase: any, date: string): Promise<string> {
  const d = new Date(date);
  const yyyymm = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  const prefix = `ITW-CERT-${yyyymm}-`;

  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .like('certificate_number', `${prefix}%`);

  const seq = ((count ?? 0) + 1).toString().padStart(4, '0');
  return `${prefix}${seq}`;
}
