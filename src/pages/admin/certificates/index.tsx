import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { previewCertificateInBrowser } from '@/utils/certificateGenerator';
import {
  Award,
  Download,
  Eye,
  X,
  CheckSquare,
  Square,
  Calendar,
  Loader2,
  ExternalLink,
  SendHorizonal,
  AlertCircle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  title: string;
}

interface StudentRow {
  studentId: string;
  enrollmentId: string;
  fullName: string;
  email: string;
  studentCode: string | null;
  enrolledAt: string;
  existingCertUrl?: string;
  existingCertNumber?: string;
}

interface PreviewState {
  studentId: string;
  studentName: string;
  courseTitle: string;
  blobUrl: string | null;
  loading: boolean;
  enrollmentId: string;
}

// ── Component ────────────────────────────────────────────────────────────────
const AdminCertificates: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [completionDate, setCompletionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Preview modal state
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [bulkIssuing, setBulkIssuing] = useState(false);
  const previewBlobRef = useRef<string | null>(null);

  // Issued results (studentId → cert info)
  const [issuedMap, setIssuedMap] = useState<Record<string, { url: string; number: string }>>({});

  // ── Auth check ───────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      if (!user) { setPageLoading(false); return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single();
      const admin = user.user_metadata?.role === 'admin' || profile?.role === 'admin';
      setIsAdmin(admin);
      if (!admin) router.push('/dashboard');
      setPageLoading(false);
    };
    check();
  }, [user, supabase, router]);

  useEffect(() => {
    if (!user && !pageLoading) router.push('/admin/login');
  }, [user, pageLoading, router]);

  // ── Fetch courses ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    supabase.from('courses').select('id, title').order('title')
      .then(({ data }) => setCourses(data ?? []));
  }, [isAdmin, supabase]);

  // ── Load enrolled students for the selected course ────────────────────────
  const loadStudents = useCallback(async () => {
    if (!selectedCourseId) { setStudents([]); return; }
    setLoadingStudents(true);
    setSelectedIds(new Set());
    setIssuedMap({});

    const [enrollmentsRes, certsRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, enrolled_at, user_id, profiles ( id, full_name, email, student_id )')
        .eq('course_id', selectedCourseId)
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('certificates')
        .select('student_id, download_url, certificate_number')
        .eq('course_id', selectedCourseId),
    ]);

    if (enrollmentsRes.error) {
      toast.error('Failed to load students');
      setLoadingStudents(false);
      return;
    }

    const certMap: Record<string, { url: string; number: string }> = {};
    (certsRes.data ?? []).forEach((c: any) => {
      certMap[c.student_id] = { url: c.download_url, number: c.certificate_number };
    });

    const rows: StudentRow[] = (enrollmentsRes.data ?? []).map((e: any) => ({
      studentId: e.profiles?.id ?? e.user_id,
      enrollmentId: e.id,
      fullName: e.profiles?.full_name ?? '—',
      email: e.profiles?.email ?? '—',
      studentCode: e.profiles?.student_id ?? null,
      enrolledAt: e.enrolled_at,
      existingCertUrl: certMap[e.profiles?.id ?? e.user_id]?.url,
      existingCertNumber: certMap[e.profiles?.id ?? e.user_id]?.number,
    }));

    setStudents(rows);
    setLoadingStudents(false);
  }, [selectedCourseId, supabase]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const toggleAll = () => {
    setSelectedIds(
      selectedIds.size === students.length
        ? new Set()
        : new Set(students.map((s) => s.studentId))
    );
  };
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Open preview for a single student ────────────────────────────────────
  const openPreview = async (student: StudentRow) => {
    if (!completionDate) { toast.error('Set a completion date first'); return; }

    const state: PreviewState = {
      studentId: student.studentId,
      enrollmentId: student.enrollmentId,
      studentName: student.fullName,
      courseTitle: selectedCourseTitle,
      blobUrl: null,
      loading: true,
    };
    setPreview(state);

    try {
      const url = await previewCertificateInBrowser({
        studentName: student.fullName,
        courseName: selectedCourseTitle,
        completionDate,
        certificateNumber: 'ITW-CERT-PREVIEW',
      });
      previewBlobRef.current = url;
      setPreview((p) => p ? { ...p, blobUrl: url, loading: false } : null);
    } catch (err: any) {
      toast.error('Preview generation failed: ' + err.message);
      setPreview(null);
    }
  };

  // ── Close preview & revoke blob URL ──────────────────────────────────────
  const closePreview = () => {
    if (previewBlobRef.current) {
      URL.revokeObjectURL(previewBlobRef.current);
      previewBlobRef.current = null;
    }
    setPreview(null);
  };

  // ── Issue a single certificate (called from preview modal) ────────────────
  const handleIssueSingle = async () => {
    if (!preview || !session?.access_token) return;
    setIssuing(true);
    try {
      const resp = await fetch('/api/admin/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          entries: [{
            studentId: preview.studentId,
            courseId: selectedCourseId,
            enrollmentId: preview.enrollmentId,
            completionDate,
          }],
        }),
      });
      const json = await resp.json();
      const result = json.results?.[0];

      if (result?.success) {
        toast.success(`Certificate issued to ${preview.studentName}`);
        setIssuedMap((prev) => ({
          ...prev,
          [preview.studentId]: { url: result.downloadUrl, number: result.certificateNumber },
        }));
        closePreview();
        await loadStudents();
      } else {
        toast.error(result?.error ?? 'Failed to issue certificate');
      }
    } catch (err: any) {
      toast.error('Issue failed: ' + err.message);
    } finally {
      setIssuing(false);
    }
  };

  // ── Bulk issue selected students (no preview) ─────────────────────────────
  const handleBulkIssue = async () => {
    if (selectedIds.size === 0) { toast.error('Select at least one student'); return; }
    if (!completionDate) { toast.error('Set a completion date first'); return; }
    if (!session?.access_token) { toast.error('Session expired'); return; }

    setBulkIssuing(true);
    const entries = students
      .filter((s) => selectedIds.has(s.studentId))
      .map((s) => ({
        studentId: s.studentId,
        courseId: selectedCourseId,
        enrollmentId: s.enrollmentId,
        completionDate,
      }));

    try {
      const resp = await fetch('/api/admin/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ entries }),
      });
      const json = await resp.json();
      const results: any[] = json.results ?? [];

      const newMap = { ...issuedMap };
      let ok = 0, fail = 0;
      results.forEach((r) => {
        if (r.success) { newMap[r.studentId] = { url: r.downloadUrl, number: r.certificateNumber }; ok++; }
        else fail++;
      });
      setIssuedMap(newMap);
      if (ok) toast.success(`${ok} certificate${ok > 1 ? 's' : ''} issued`);
      if (fail) toast.error(`${fail} failed`);
      setSelectedIds(new Set());
      await loadStudents();
    } catch (err: any) {
      toast.error('Bulk issue failed: ' + err.message);
    } finally {
      setBulkIssuing(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const allSelected = students.length > 0 && selectedIds.size === students.length;

  const getCert = (s: StudentRow) =>
    issuedMap[s.studentId] ??
    (s.existingCertUrl ? { url: s.existingCertUrl, number: s.existingCertNumber ?? '' } : null);

  // ── Render ────────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <>
      <Head>
        <title>Certificates — ITwala Admin</title>
      </Head>

      <div className="p-6 max-w-6xl mx-auto">
          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-7 h-7 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Completion Certificates</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Preview each certificate before issuing it to the student dashboard.
              </p>
            </div>
          </div>

          {/* ── Controls panel ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedCourseTitle(
                      courses.find((c) => c.id === e.target.value)?.title ?? ''
                    );
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">— Choose a course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Completion Date
                </label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Bulk action bar */}
            {students.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>

                <span className="text-sm text-gray-400">
                  {selectedIds.size} of {students.length} selected
                </span>

                <div className="flex-1" />

                {/* Tip for new users */}
                {selectedIds.size === 0 && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Use Preview per student to review, or select many and Issue All
                  </span>
                )}

                {selectedIds.size > 0 && (
                  <button
                    onClick={handleBulkIssue}
                    disabled={bulkIssuing}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {bulkIssuing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Issuing…</>
                    ) : (
                      <><SendHorizonal className="w-4 h-4" /> Issue {selectedIds.size} to Dashboard</>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* ── Student table ────────────────────────────────────────────── */}
          {selectedCourseId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {loadingStudents ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  No enrolled students found for this course.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <button onClick={toggleAll}>
                          {allSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Enrolled</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Certificate</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((s) => {
                      const cert = getCert(s);
                      const checked = selectedIds.has(s.studentId);

                      return (
                        <tr
                          key={s.studentId}
                          className={`transition-colors ${checked ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3">
                            <button onClick={() => toggleOne(s.studentId)}>
                              {checked ? (
                                <CheckSquare className="w-4 h-4 text-primary-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{s.fullName}</p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </td>

                          <td className="px-4 py-3 font-mono text-xs text-gray-500">
                            {s.studentCode ?? '—'}
                          </td>

                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(s.enrolledAt).toLocaleDateString('en-IN')}
                          </td>

                          <td className="px-4 py-3">
                            {cert ? (
                              <div>
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download PDF
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <p className="text-gray-400 font-mono text-xs mt-0.5">{cert.number}</p>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Not issued</span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <button
                              onClick={() => openPreview(s)}
                              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}
        </div>

      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden"
              style={{ height: '88vh' }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Certificate Preview</h2>
                  <p className="text-sm text-gray-500">
                    {preview.studentName} — {preview.courseTitle}
                  </p>
                </div>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF iframe */}
              <div className="flex-1 bg-gray-100 overflow-hidden">
                {preview.loading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Generating preview…</span>
                  </div>
                ) : preview.blobUrl ? (
                  <iframe
                    src={preview.blobUrl}
                    className="w-full h-full border-0"
                    title="Certificate Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Preview unavailable
                  </div>
                )}
              </div>

              {/* Modal footer actions */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 flex-shrink-0">
                <p className="text-xs text-gray-400 max-w-md">
                  The preview uses a placeholder certificate number. The final PDF stored on the student
                  dashboard will have a unique certificate number assigned automatically.
                </p>

                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleIssueSingle}
                    disabled={issuing || preview.loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {issuing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Issuing…</>
                    ) : (
                      <><SendHorizonal className="w-4 h-4" /> Issue to Dashboard</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminCertificates;
