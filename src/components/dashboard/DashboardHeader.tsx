import { useUser } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  userData?: {
    email?: string;
    name?: string;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData }) => {
  const user = useUser();
  const displayName = userData?.name || user?.email || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary-600 to-primary-800 text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}</h1>
        <p className="text-primary-100">Continue your learning journey</p>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
