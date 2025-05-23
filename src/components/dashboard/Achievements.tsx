import { motion } from 'framer-motion';

const Achievements = () => {
  // Mock achievements - in a real app, fetch from backend
  const achievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Complete 3 lessons in one day',
      icon: '🎯',
      unlocked: true
    },
    {
      id: 2,
      title: 'Course Explorer',
      description: 'Enroll in your first course',
      icon: '🎓',
      unlocked: true
    },
    {
      id: 3,
      title: 'Consistent Learner',
      description: 'Study for 5 days in a row',
      icon: '🔥',
      unlocked: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border ${
              achievement.unlocked
                ? 'border-primary-200 bg-primary-50'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <h3 className="font-medium text-gray-900 mb-1">{achievement.title}</h3>
            <p className="text-sm text-gray-500">{achievement.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Achievements;
