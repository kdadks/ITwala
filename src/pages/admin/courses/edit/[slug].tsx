import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  price: number;
  original_price: number;
  level: string;
  duration: string;
  status: string;
  learning_outcomes: string[];
  requirements: string[];
  tags: string[];
  language: string;
  certification_included: boolean;
  fees_discussed_post_enrollment: boolean;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    lessons: Array<{
      id: string;
      title: string;
      type: string;
      content: string;
      isPreview?: boolean;
    }>;
  }>;
}

const EditCourse: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    slug: '',
    description: '',
    category: '',
    image: '',
    price: 0,
    original_price: 0,
    level: 'Beginner',
    duration: '',
    status: 'draft',
    learning_outcomes: [],
    requirements: [],
    tags: [],
    language: 'English',
    certification_included: false,
    fees_discussed_post_enrollment: false,
    modules: []
  });

  // For managing dynamic arrays
  const [learningOutcomeInput, setLearningOutcomeInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // For managing modules
  const [moduleInput, setModuleInput] = useState({ title: '', description: '' });
  const [lessonInput, setLessonInput] = useState({ title: '', type: 'video', content: '' });
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkAdminAndFetchCourse = async () => {
      if (!user || !slug) return;

      try {
        // Check admin status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        // Fetch course data
        console.log('Fetching course with slug:', slug);
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .single();

        console.log('Fetched course data:', courseData);
        console.log('Course fetch error:', courseError);

        if (courseError) throw courseError;

        if (!courseData) {
          toast.error('Course not found');
          router.push('/admin/courses');
          return;
        }

        // Populate form with course data
        setCourseId(courseData.id);
        setFormData({
          title: courseData.title || '',
          slug: courseData.slug || '',
          description: courseData.description || '',
          category: courseData.category || '',
          image: courseData.image || '',
          price: courseData.price || 0,
          original_price: courseData.original_price || 0,
          level: courseData.level || 'Beginner',
          duration: courseData.duration || '',
          status: courseData.status || 'draft',
          learning_outcomes: courseData.learning_outcomes || [],
          requirements: courseData.requirements || [],
          tags: courseData.tags || [],
          language: courseData.language || 'English',
          certification_included: courseData.certification_included || false,
          fees_discussed_post_enrollment: courseData.fees_discussed_post_enrollment || false,
          modules: courseData.modules || []
        });

      } catch (error: any) {
        console.error('Error:', error);
        toast.error(error.message || 'Failed to load course');
        router.push('/admin/courses');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndFetchCourse();
  }, [user, slug, supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddLearningOutcome = () => {
    if (learningOutcomeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        learning_outcomes: [...prev.learning_outcomes, learningOutcomeInput.trim()]
      }));
      setLearningOutcomeInput('');
    }
  };

  const handleRemoveLearningOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning_outcomes: prev.learning_outcomes.filter((_, i) => i !== index)
    }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Module management functions
  const handleAddModule = () => {
    if (moduleInput.title.trim() && moduleInput.description.trim()) {
      const newModule = {
        id: `module-${Date.now()}`,
        title: moduleInput.title.trim(),
        description: moduleInput.description.trim(),
        lessons: []
      };
      setFormData(prev => ({
        ...prev,
        modules: [...prev.modules, newModule]
      }));
      setModuleInput({ title: '', description: '' });
    }
  };

  const handleRemoveModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
    if (selectedModuleIndex === index) {
      setSelectedModuleIndex(null);
    }
  };

  const handleAddLesson = () => {
    if (selectedModuleIndex !== null && lessonInput.title.trim() && lessonInput.content.trim()) {
      const newLesson = {
        id: `lesson-${Date.now()}`,
        title: lessonInput.title.trim(),
        type: lessonInput.type,
        content: lessonInput.content.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map((module, index) =>
          index === selectedModuleIndex
            ? { ...module, lessons: [...module.lessons, newLesson] }
            : module
        )
      }));
      setLessonInput({ title: '', type: 'video', content: '' });
    }
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? { ...module, lessons: module.lessons.filter((_, i) => i !== lessonIndex) }
          : module
      )
    }));
  };

  // Auto-generate modules based on learning outcomes
  const generateModulesFromOutcomes = () => {
    if (formData.learning_outcomes.length === 0) return;
    
    const generatedModules = formData.learning_outcomes.map((outcome, index) => ({
      id: `auto-module-${index + 1}`,
      title: `Module ${index + 1}: ${outcome}`,
      description: `This module focuses on: ${outcome}`,
      lessons: [
        {
          id: `auto-lesson-${index + 1}-1`,
          title: `Introduction to ${outcome}`,
          type: 'video',
          content: `Learn the fundamentals of ${outcome.toLowerCase()}`
        },
        {
          id: `auto-lesson-${index + 1}-2`,
          title: `Practical Application`,
          type: 'lab',
          content: `Hands-on practice with ${outcome.toLowerCase()}`
        }
      ]
    }));

    setFormData(prev => ({
      ...prev,
      modules: generatedModules
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Updating course with data:', {
        id: courseId,
        title: formData.title,
        fees_discussed_post_enrollment: formData.fees_discussed_post_enrollment,
        modules: formData.modules
      });

      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          category: formData.category,
          image: formData.image,
          price: Number(formData.price),
          original_price: Number(formData.original_price),
          level: formData.level,
          duration: formData.duration,
          status: formData.status,
          learning_outcomes: formData.learning_outcomes,
          requirements: formData.requirements,
          tags: formData.tags,
          language: formData.language,
          certification_included: formData.certification_included,
          fees_discussed_post_enrollment: formData.fees_discussed_post_enrollment,
          modules: formData.modules
        }),
      });

      const result = await response.json();

      console.log('Update result:', { response: response.status, result });

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update course');
      }

      toast.success('Course updated successfully');
      router.push('/admin/courses');
    } catch (error: any) {
      console.error('Error updating course:', error);
      
      // More specific error messages
      if (error.message?.includes('fees_discussed_post_enrollment')) {
        toast.error('Database schema error: Please run the database migration first. Check the console for details.');
      } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        toast.error('Database column missing. Please run the database migration.');
      } else {
        toast.error(error.message || 'Failed to update course');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Edit Course - ITwala Academy Admin</title>
        <meta name="description" content="Edit course on ITwala Academy." />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Update the course details below.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Course Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        URL Slug
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="slug"
                          id="slug"
                          required
                          value={formData.slug}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          required
                          value={formData.description}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Product Management">Product Management</option>
                          <option value="Prompt Engineering">Prompt Engineering</option>
                          <option value="Agentic AI">Agentic AI</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Development">Mobile Development</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <div className="mt-1">
                        <select
                          id="level"
                          name="level"
                          required
                          value={formData.level}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Course Image URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="image"
                          id="image"
                          value={formData.image}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="/images/Tech Professional at Work.jpeg"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="duration"
                          id="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="8 weeks"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Registration Fee (₹)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          required
                          value={formData.price}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                        Original Registration Fee (₹)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="original_price"
                          id="original_price"
                          min="0"
                          value={formData.original_price}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          required
                          value={formData.status}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <div className="mt-1">
                        <select
                          id="language"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center">
                        <input
                          id="certification_included"
                          name="certification_included"
                          type="checkbox"
                          checked={formData.certification_included}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="certification_included" className="ml-2 block text-sm text-gray-900">
                          Certification Included
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="flex items-center">
                        <input
                          id="fees_discussed_post_enrollment"
                          name="fees_discussed_post_enrollment"
                          type="checkbox"
                          checked={formData.fees_discussed_post_enrollment}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="fees_discussed_post_enrollment" className="ml-2 block text-sm text-gray-900">
                          Tuition fees will be discussed post enrollment
                        </label>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Learning Outcomes
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={learningOutcomeInput}
                            onChange={(e) => setLearningOutcomeInput(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Add a learning outcome"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearningOutcome())}
                          />
                          <button
                            type="button"
                            onClick={handleAddLearningOutcome}
                            className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.learning_outcomes.map((outcome, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{outcome}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLearningOutcome(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Requirements
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={requirementInput}
                            onChange={(e) => setRequirementInput(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Add a requirement"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                          />
                          <button
                            type="button"
                            onClick={handleAddRequirement}
                            className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.requirements.map((requirement, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{requirement}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRequirement(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Add a tag"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="ml-1 text-primary-600 hover:text-primary-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Course Modules */}
                    <div className="sm:col-span-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Course Modules
                        </label>
                        <button
                          type="button"
                          onClick={generateModulesFromOutcomes}
                          disabled={formData.learning_outcomes.length === 0}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Auto-generate from Learning Outcomes
                        </button>
                      </div>
                      
                      {/* Add Module Form */}
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Module</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            type="text"
                            placeholder="Module title"
                            value={moduleInput.title}
                            onChange={(e) => setModuleInput(prev => ({ ...prev, title: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                          <textarea
                            placeholder="Module description"
                            value={moduleInput.description}
                            onChange={(e) => setModuleInput(prev => ({ ...prev, description: e.target.value }))}
                            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={handleAddModule}
                            className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Add Module
                          </button>
                        </div>
                      </div>

                      {/* Modules List */}
                      <div className="space-y-4">
                        {formData.modules.map((module, moduleIndex) => (
                          <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900">{module.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedModuleIndex(moduleIndex)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    selectedModuleIndex === moduleIndex
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  {selectedModuleIndex === moduleIndex ? 'Selected' : 'Select'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveModule(moduleIndex)}
                                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                            
                            {/* Lessons */}
                            <div className="ml-4">
                              <h5 className="text-xs font-medium text-gray-700 mb-1">Lessons ({module.lessons.length})</h5>
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center justify-between py-1 text-sm">
                                  <span className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{lesson.type}</span>
                                    {lesson.title}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Lesson Form */}
                      {selectedModuleIndex !== null && (
                        <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <h4 className="text-sm font-medium text-blue-700 mb-2">
                            Add Lesson to: {formData.modules[selectedModuleIndex]?.title}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <input
                              type="text"
                              placeholder="Lesson title"
                              value={lessonInput.title}
                              onChange={(e) => setLessonInput(prev => ({ ...prev, title: e.target.value }))}
                              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                            <select
                              value={lessonInput.type}
                              onChange={(e) => setLessonInput(prev => ({ ...prev, type: e.target.value }))}
                              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            >
                              <option value="video">Video</option>
                              <option value="reading">Reading</option>
                              <option value="lab">Lab/Exercise</option>
                              <option value="quiz">Quiz</option>
                            </select>
                            <textarea
                              placeholder="Lesson content description"
                              value={lessonInput.content}
                              onChange={(e) => setLessonInput(prev => ({ ...prev, content: e.target.value }))}
                              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              rows={2}
                            />
                            <button
                              type="button"
                              onClick={handleAddLesson}
                              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                              Add Lesson
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Course'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EditCourse;