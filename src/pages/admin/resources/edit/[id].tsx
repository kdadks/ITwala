import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BlogForm from '@/components/admin/resources/BlogForm';
import { ResourceArticle } from '@/types/resources';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blogData, setBlogData] = useState<ResourceArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/resources/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog details');
      const data = await res.json();
      setBlogData(data.resource);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading blog details');
      router.push('/admin/resources');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mr-3" />
        <span className="text-sm font-medium">Loading blog editor...</span>
      </div>
    );
  }

  if (!blogData) return null;

  return <BlogForm initialData={blogData} isEditing={true} />;
}
