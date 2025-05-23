import { motion } from 'framer-motion';

const RecentActivity = () => {
  // Mock activity data - in a real app, fetch from backend
  const activities = [
    {
      id: 1,
      type: 'lesson_completed',
      course: 'AI & Machine Learning Fundamentals',
      lesson: 'Introduction to Neural Networks',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'course_enrolled',
      course: 'Prompt Engineering Fundamentals',
      timestamp: '1 day ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return '✅';
      case 'course_enrolled':
        return '🎉';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'lesson_completed':
        return `Completed "${activity.lesson}" in ${activity.course}`;
      case 'course_enrolled':
        return `Enrolled in ${activity.course}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <span className="text-xl">{getActivityIcon(activity.type)}</span>
              <div>
                <p className="text-gray-900">{getActivityText(activity)}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentActivity;
