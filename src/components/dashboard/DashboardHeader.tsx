import { useUser } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  userData?: {
    email?: string;
    name?: string;
    studentId?: string | null;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData }) => {
  const user = useUser();
  const displayName = userData?.name || user?.user_metadata?.full_name || user?.email || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary-600 to-primary-800 text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}</h1>
            <p className="text-primary-100">Continue your learning journey</p>
          </div>
          {userData?.studentId && (
            <div className="text-right">
              <p className="text-sm text-primary-200 mb-1">Student ID</p>
              <p className="text-lg font-mono bg-primary-700/30 px-4 py-2 rounded-md border border-primary-500/30">
                {userData.studentId}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
