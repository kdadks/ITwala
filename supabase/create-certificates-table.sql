-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  completion_date DATE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  issued_by UUID REFERENCES public.profiles(id),
  storage_path TEXT,
  download_url TEXT,
  CONSTRAINT certificates_unique_student_course UNIQUE (student_id, course_id)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Students can view their own certificates
CREATE POLICY "Students can view own certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can do everything with certificates
CREATE POLICY "Admins can manage certificates"
  ON public.certificates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create Supabase Storage bucket for certificates
-- Run this separately if the bucket doesn't exist:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('certificates', 'certificates', true, 5242880, ARRAY['application/pdf'])
-- ON CONFLICT (id) DO NOTHING;

-- Storage RLS: students can read their own certificates
-- CREATE POLICY "Students can read own certificates"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'certificates' AND
--     (storage.foldername(name))[1] = auth.uid()::text
--   );

-- Storage RLS: admins can manage all certificates
-- CREATE POLICY "Admins can manage certificate files"
--   ON storage.objects FOR ALL
--   USING (
--     bucket_id = 'certificates' AND
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );
