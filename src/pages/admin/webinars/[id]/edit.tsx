import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowLeft, AlertCircle } from 'lucide-react';

type MediaType = 'youtube' | 'link' | 'none';
type WebinarStatus = 'draft' | 'published' | 'cancelled' | 'completed';
type FieldType = 'text' | 'select';

interface CustomFieldForm {
  label: string;
  type: FieldType;
  required: boolean;
  options: string;
}

interface WebinarFormValues {
  title: string;
  description: string;
  banner_image: string;
  date_time: string;
  duration_minutes: number;
  speaker_name: string;
  speaker_title: string;
  speaker_bio: string;
  speaker_image: string;
  topics: { value: string }[];
  learning_outcomes: { value: string }[];
  media_url: string;
  media_type: MediaType;
  registration_limit: number;
  status: WebinarStatus;
  custom_fields: CustomFieldForm[];
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{children}</h2>
);

const toLocalDatetimeValue = (iso: string | null | undefined): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
};

const EditWebinar: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webinarTitle, setWebinarTitle] = useState('');
  const [registrationCount, setRegistrationCount] = useState(0);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<WebinarFormValues>({
    defaultValues: {
      title: '',
      description: '',
      banner_image: '',
      date_time: '',
      duration_minutes: 60,
      speaker_name: '',
      speaker_title: '',
      speaker_bio: '',
      speaker_image: '',
      topics: [],
      learning_outcomes: [],
      media_url: '',
      media_type: 'none',
      registration_limit: 0,
      status: 'draft',
      custom_fields: [],
    },
  });

  const topicsArray = useFieldArray({ control, name: 'topics' });
  const outcomesArray = useFieldArray({ control, name: 'learning_outcomes' });
  const customFieldsArray = useFieldArray({ control, name: 'custom_fields' });

  const watchedMediaType = watch('media_type');

  const getToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Admin check error:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/admin/login');
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!id || !isAdmin || dataLoaded) return;

    const fetchWebinar = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/api/admin/webinars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch webinar');
        const json = await res.json();
        const data = json.webinar ?? json;

        setWebinarTitle(data.title || '');
        setRegistrationCount(data.registration_count || 0);

        const customFields: CustomFieldForm[] = (data.custom_fields || []).map((cf: any) => ({
          label: cf.label || '',
          type: cf.type || 'text',
          required: cf.required || false,
          options: Array.isArray(cf.options) ? cf.options.join(', ') : '',
        }));

        reset({
          title: data.title || '',
          description: data.description || '',
          banner_image: data.banner_image || '',
          date_time: toLocalDatetimeValue(data.date_time),
          duration_minutes: data.duration_minutes || 60,
          speaker_name: data.speaker_name || '',
          speaker_title: data.speaker_title || '',
          speaker_bio: data.speaker_bio || '',
          speaker_image: data.speaker_image || '',
          topics: (data.topics || []).map((t: string) => ({ value: t })),
          learning_outcomes: (data.learning_outcomes || []).map((o: string) => ({ value: o })),
          media_url: data.media_url || '',
          media_type: data.media_type || 'none',
          registration_limit: data.registration_limit || 0,
          status: data.status || 'draft',
          custom_fields: customFields,
        });

        setDataLoaded(true);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load webinar');
      }
    };

    fetchWebinar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin, dataLoaded]);

  const buildPayload = (data: WebinarFormValues) => {
    const customFields = data.custom_fields.map((cf, i) => ({
      id: `cf_${i}`,
      label: cf.label,
      type: cf.type,
      required: cf.required,
      options: cf.type === 'select' ? cf.options.split(',').map((o) => o.trim()).filter(Boolean) : undefined,
    }));

    return {
      title: data.title,
      description: data.description,
      banner_image: data.banner_image || null,
      date_time: data.date_time ? new Date(data.date_time).toISOString() : null,
      duration_minutes: Number(data.duration_minutes),
      speaker_name: data.speaker_name,
      speaker_title: data.speaker_title,
      speaker_bio: data.speaker_bio,
      speaker_image: data.speaker_image || null,
      topics: data.topics.map((t) => t.value).filter(Boolean),
      learning_outcomes: data.learning_outcomes.map((o) => o.value).filter(Boolean),
      media_url: data.media_type !== 'none' ? data.media_url : null,
      media_type: data.media_type !== 'none' ? data.media_type : null,
      registration_limit: Number(data.registration_limit) || null,
      status: data.status,
      custom_fields: customFields,
    };
  };

  const onSubmit = async (data: WebinarFormValues) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const payload = buildPayload(data);
      const res = await fetch(`/api/admin/webinars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update webinar');
      }
      toast.success('Webinar updated successfully');
      router.push('/admin/webinars');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update webinar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Webinar - ITwala Academy Admin</title>
        <meta name="description" content="Edit webinar details" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/admin/webinars">
              <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Back to Webinars
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Edit Webinar{webinarTitle ? `: ${webinarTitle}` : ''}
          </h1>

          {registrationCount > 0 && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                <span className="font-semibold">{registrationCount} {registrationCount === 1 ? 'person has' : 'people have'} registered</span>
                {' '}— deleting this webinar will remove all registrations.
              </p>
            </div>
          )}

          {!dataLoaded && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}

          {dataLoaded && (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6">
                {/* Section 1: Basic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <SectionHeading>Basic Info</SectionHeading>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Title *</label>
                      <input
                        {...register('title', { required: 'Title is required' })}
                        className={inputClass}
                        placeholder="Webinar title"
                      />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        {...register('description')}
                        rows={4}
                        className={inputClass}
                        placeholder="Describe the webinar..."
                      />
                    </div>
                    <div>
                      <Controller
                        name="banner_image"
                        control={control}
                        render={({ field }) => (
                          <MediaPicker
                            value={field.value}
                            onChange={field.onChange}
                            accept="image"
                            label="Banner Image"
                          />
                        )}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Section 2: Schedule */}
                <div className="bg-white rounded-lg shadow p-6">
                  <SectionHeading>Schedule</SectionHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Date & Time *</label>
                      <input
                        {...register('date_time', { required: 'Date and time is required' })}
                        type="datetime-local"
                        className={inputClass}
                      />
                      {errors.date_time && <p className="text-red-500 text-xs mt-1">{errors.date_time.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Duration (minutes) *</label>
                      <input
                        {...register('duration_minutes', {
                          required: 'Duration is required',
                          min: { value: 15, message: 'Minimum 15 minutes' },
                          max: { value: 480, message: 'Maximum 480 minutes' },
                        })}
                        type="number"
                        min={15}
                        max={480}
                        className={inputClass}
                      />
                      {errors.duration_minutes && (
                        <p className="text-red-500 text-xs mt-1">{errors.duration_minutes.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Speaker */}
                <div className="bg-white rounded-lg shadow p-6">
                  <SectionHeading>Speaker</SectionHeading>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Speaker Name</label>
                        <input {...register('speaker_name')} className={inputClass} placeholder="Full name" />
                      </div>
                      <div>
                        <label className={labelClass}>Speaker Title / Role</label>
                        <input {...register('speaker_title')} className={inputClass} placeholder="e.g. CEO, Lead Engineer" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Speaker Bio</label>
                      <textarea {...register('speaker_bio')} rows={3} className={inputClass} placeholder="Brief biography..." />
                    </div>
                    <div>
                      <Controller
                        name="speaker_image"
                        control={control}
                        render={({ field }) => (
                          <MediaPicker
                            value={field.value}
                            onChange={field.onChange}
                            accept="image"
                            label="Speaker Image"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Topics & Outcomes */}
                <div className="bg-white rounded-lg shadow p-6">
                  <SectionHeading>Topics & Learning Outcomes</SectionHeading>
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Topics</label>
                      <div className="space-y-2">
                        {topicsArray.fields.map((field, index) => (
                          <div key={field.id} className="flex gap-2">
                            <input
                              {...register(`topics.${index}.value`)}
                              className={inputClass}
                              placeholder={`Topic ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => topicsArray.remove(index)}
                              className="text-red-400 hover:text-red-600 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => topicsArray.append({ value: '' })}
                          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                        >
                          <Plus className="w-4 h-4" />
                          Add Topic
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Learning Outcomes</label>
                      <div className="space-y-2">
                        {outcomesArray.fields.map((field, index) => (
                          <div key={field.id} className="flex gap-2">
                            <input
                              {...register(`learning_outcomes.${index}.value`)}
                              className={inputClass}
                              placeholder={`Outcome ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => outcomesArray.remove(index)}
                              className="text-red-400 hover:text-red-600 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => outcomesArray.append({ value: '' })}
                          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                        >
                          <Plus className="w-4 h-4" />
                          Add Learning Outcome
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Media */}
                <div className="bg-white rounded-lg shadow p-6">
                  <SectionHeading>Media</SectionHeading>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Media Type</label>
                      <div className="flex gap-6">
                        {(['none', 'youtube', 'link'] as MediaType[]).map((mt) => (
                          <label key={mt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              {...register('media_type')}
                              type="radio"
                              value={mt}
                              className="text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {mt === 'none' ? 'None' : mt === 'youtube' ? 'YouTube' : 'Link'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {watchedMediaType !== 'none' && (
                      <div>
                        <label className={labelClass}>Media URL</label>
                        <input
                          {...register('media_url')}
                          className={inputClass}
                          placeholder={watchedMediaType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                          type="url"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 6: Registration */}
                <div className="bg-white rounded-lg shadow p-6">
                  <SectionHeading>Registration</SectionHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Registration Limit (0 = unlimited)</label>
                      <input
                        {...register('registration_limit', { min: { value: 0, message: 'Must be 0 or more' } })}
                        type="number"
                        min={0}
                        className={inputClass}
                      />
                      {errors.registration_limit && (
                        <p className="text-red-500 text-xs mt-1">{errors.registration_limit.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select {...register('status')} className={inputClass}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 7: Custom Fields */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setCustomFieldsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-base font-semibold text-gray-800">
                      Custom Registration Fields{' '}
                      <span className="text-sm font-normal text-gray-400">
                        ({customFieldsArray.fields.length}/3)
                      </span>
                    </span>
                    {customFieldsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {customFieldsOpen && (
                    <div className="px-6 pb-6 border-t border-gray-100 space-y-4 pt-4">
                      {customFieldsArray.fields.map((field, index) => {
                        const watchedType = watch(`custom_fields.${index}.type`);
                        return (
                          <div key={field.id} className="border border-gray-200 rounded-md p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Field {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => customFieldsArray.remove(index)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={labelClass}>Label *</label>
                                <input
                                  {...register(`custom_fields.${index}.label`, { required: 'Label required' })}
                                  className={inputClass}
                                  placeholder="e.g. Company Size"
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Type</label>
                                <select {...register(`custom_fields.${index}.type`)} className={inputClass}>
                                  <option value="text">Text</option>
                                  <option value="select">Select / Dropdown</option>
                                </select>
                              </div>
                            </div>
                            {watchedType === 'select' && (
                              <div>
                                <label className={labelClass}>Options (comma-separated)</label>
                                <input
                                  {...register(`custom_fields.${index}.options`)}
                                  className={inputClass}
                                  placeholder="Option A, Option B, Option C"
                                />
                              </div>
                            )}
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                {...register(`custom_fields.${index}.required`)}
                                type="checkbox"
                                className="rounded text-primary-500 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700">Required field</span>
                            </label>
                          </div>
                        );
                      })}

                      {customFieldsArray.fields.length < 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            customFieldsArray.append({ label: '', type: 'text', required: false, options: '' })
                          }
                          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                        >
                          <Plus className="w-4 h-4" />
                          Add Custom Field
                        </button>
                      )}
                      {customFieldsArray.fields.length >= 3 && (
                        <p className="text-xs text-gray-400">Maximum of 3 custom fields allowed.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pb-8">
                  <Link href="/admin/webinars">
                    <div className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      Cancel
                    </div>
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default EditWebinar;
