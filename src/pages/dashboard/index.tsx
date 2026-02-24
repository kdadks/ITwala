import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EnrolledCourses from '@/components/dashboard/EnrolledCourses';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses';
import Achievements from '@/components/dashboard/Achievements';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AttendanceCard from '@/components/dashboard/AttendanceCard';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Student Dashboard - ITwala Academy</title>
        <meta name="description" content="Access your enrolled courses, track your progress, and manage your learning journey on ITwala Academy." />
      </Head>

      <main className="bg-gray-50 min-h-screen pb-12">
        <DashboardHeader userData={{
          name: profile?.full_name || user?.user_metadata?.full_name || 'Student',
          email: user?.email,
          studentId: profile?.student_id
        }} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EnrolledCourses />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <UpcomingSessions />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <RecentActivity />
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <AttendanceCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Achievements />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <RecommendedCourses />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;