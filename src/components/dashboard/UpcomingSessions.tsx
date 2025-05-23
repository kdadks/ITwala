import { motion } from 'framer-motion';

const UpcomingSessions = () => {
  // Mock data - in a real app, fetch from backend
  const mockSessions = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Live Sessions</h2>
      
      {mockSessions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No upcoming sessions scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              {/* Session details would go here */}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingSessions;
