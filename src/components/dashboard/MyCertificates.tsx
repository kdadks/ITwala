import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Loader2 } from 'lucide-react';

interface Certificate {
  id: string;
  certificate_number: string;
  completion_date: string;
  issued_at: string;
  download_url: string;
  courses: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

const MyCertificates = () => {
  const session = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) { setLoading(false); return; }

    fetch('/api/certificates/my-certificates', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((json) => setCertificates(json.certificates ?? []))
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" />
        My Certificates
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No certificates issued yet.</p>
          <p className="text-xs mt-1">Complete a course to earn your certificate.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gradient-to-r from-yellow-50 to-white hover:border-yellow-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {cert.courses?.title ?? 'Course Completion'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Issued: {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{cert.certificate_number}</p>
                </div>
              </div>
              <a
                href={cert.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Download
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyCertificates;
