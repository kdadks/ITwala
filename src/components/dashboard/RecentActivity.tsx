import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface ActivityItem {
  id: string;
  type: 'lesson_completed' | 'course_enrolled' | 'course_reviewed';
  course: string;
  lesson?: string;
  timestamp: string;
  created_at: string;
}

const RecentActivity = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecentActivity = async () => {
      try {
        const activityItems: ActivityItem[] = [];

        // Fetch recent enrollments with course titles
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            enrolled_at,
            course:courses(title)
          `)
          .eq('user_id', user.id)
          .order('enrolled_at', { ascending: false })
          .limit(5);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        if (enrollments) {
          enrollments.forEach((enrollment: any) => {
            const courseTitle = enrollment.course?.title || 'Unknown Course';
            activityItems.push({
              id: enrollment.id,
              type: 'course_enrolled',
              course: courseTitle,
              timestamp: formatTimestamp(enrollment.enrolled_at),
              created_at: enrollment.enrolled_at
            });
          });
        }

        // Fetch recent lesson completions using progress table
        const { data: progress, error: progressError } = await supabase
          .from('progress')
          .select(`
            id,
            completed_at,
            lesson_id,
            course:courses(title)
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(5);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
        }

        if (progress) {
          progress.forEach((prog: any) => {
            if (prog.completed_at) {
              const courseTitle = prog.course?.title || 'Unknown Course';
              activityItems.push({
                id: prog.id,
                type: 'lesson_completed',
                course: courseTitle,
                lesson: `Lesson ${prog.lesson_id || 'Unknown'}`,
                timestamp: formatTimestamp(prog.completed_at),
                created_at: prog.completed_at
              });
            }
          });
        }

        // Fetch recent reviews using reviews table
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            created_at,
            course:courses(title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }

        if (reviews) {
          reviews.forEach((review: any) => {
            const courseTitle = review.course?.title || 'Unknown Course';
            activityItems.push({
              id: review.id,
              type: 'course_reviewed',
              course: courseTitle,
              timestamp: formatTimestamp(review.created_at),
              created_at: review.created_at
            });
          });
        }

        // Sort all activities by timestamp and take the most recent 10
        const sortedActivities = activityItems
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10);

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
  }, [user, supabase]);

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return '✅';
      case 'course_enrolled':
        return '🎉';
      case 'course_reviewed':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'lesson_completed':
        return `Completed "${activity.lesson}" in ${activity.course}`;
      case 'course_enrolled':
        return `Enrolled in ${activity.course}`;
      case 'course_reviewed':
        return `Reviewed ${activity.course}`;
      default:
        return 'Unknown activity';
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

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
