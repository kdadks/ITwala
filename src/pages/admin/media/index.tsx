import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { MediaLibrary } from '@/components/admin/media/MediaLibrary';

const MediaLibraryPage: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!user) { setAuthChecked(true); return; }

    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/admin');
        }
        setAuthChecked(true);
      });
  }, [user, supabase, router]);

  useEffect(() => {
    if (authChecked && !user) router.push('/admin/login');
  }, [authChecked, user, router]);

  if (!authChecked || !isAdmin) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Media Library — Admin</title>
      </Head>
      <main className="flex-1 bg-gray-50 p-6 flex flex-col min-h-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage images, videos, and documents used across your site.
          </p>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-0">
          <MediaLibrary />
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default MediaLibraryPage;
