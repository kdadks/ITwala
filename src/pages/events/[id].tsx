import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { countries, getStatesByCountry, getCountryIsoCode } from '@/utils/locationData';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select';
  required?: boolean;
  options?: string[];
}

interface Webinar {
  id: string;
  title: string;
  slug: string;
  description: string;
  date_time: string;
  duration_minutes: number;
  speaker_name: string;
  speaker_title: string;
  speaker_bio?: string;
  speaker_image?: string;
  banner_image?: string;
  topics?: string[];
  learning_outcomes?: string[];
  registration_limit?: number;
  registration_count?: number;
  custom_fields?: CustomField[];
  media_url?: string;
  media_type?: 'youtube' | 'link';
}

interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization?: string;
  job_title?: string;
  country: string;
  state?: string;
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

function normalizeImageSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src;
  const clean = src.startsWith('public/') ? src.slice(7) : src;
  return `/${clean}`;
}

function formatShortDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function SpeakerAvatar({
  name,
  image,
  size = 'md',
}: {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
  const textClass = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-base';
  const initials = (name ?? '')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  if (image) {
    return (
      <div className={`relative ${sizeClass} rounded-full overflow-hidden flex-shrink-0`}>
        <Image src={normalizeImageSrc(image)} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold ${textClass} flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-page spinner
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Registration form
// ---------------------------------------------------------------------------

function RegistrationCard({ webinar }: { webinar: Webinar }) {
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({ shouldUnregister: true });

  const watchedCountry = watch('country', '');
  const selectedCountryCode = getCountryIsoCode(watchedCountry);
  const stateOptions = getStatesByCountry(selectedCountryCode);
  const showStateDropdown = stateOptions.length > 1;

  useEffect(() => {
    if (watchedCountry) setValue('state', '');
  }, [watchedCountry, setValue]);

  const seatsRemaining =
    webinar.registration_limit && webinar.registration_count !== undefined
      ? webinar.registration_limit - webinar.registration_count
      : null;

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const res = await fetch(`/api/webinars/${webinar.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        setAlreadyRegistered(true);
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error || body?.message || 'Registration failed. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re registered!</h3>
        <p className="text-gray-600">Check your email for confirmation and event details.</p>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-primary-100">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Already registered!</h3>
        <p className="text-gray-600">You&apos;re already registered for this event. See you there!</p>
      </div>
    );
  }

  return (
    <div id="register-form" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Reserve Your Free Spot</h3>

      {seatsRemaining !== null && (
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-accent-500" />
          <span className="text-sm font-medium text-accent-600">
            {seatsRemaining > 0
              ? `${seatsRemaining} seat${seatsRemaining !== 1 ? 's' : ''} remaining`
              : 'Waitlist only'}
          </span>
        </div>
      )}

      {!seatsRemaining && webinar.registration_limit === undefined && (
        <p className="text-sm text-gray-500 mb-4">Open registration — join anytime.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('first_name', { required: 'Required' })}
              placeholder="Jane"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.first_name && (
              <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('last_name', { required: 'Required' })}
              placeholder="Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.last_name && (
              <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
            })}
            placeholder="jane@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\+[\d\s\-().]{6,20}$/,
                message: 'Enter a valid international number starting with + (e.g. +91 98765 43210)',
              },
            })}
            placeholder="+91 98765 43210"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Organization</label>
          <input
            {...register('organization')}
            placeholder="Your company or institution"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
          <input
            {...register('job_title')}
            placeholder="Software Engineer, Student, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            {...register('country', { required: 'Country is required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select country…</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* State / Region — shown for countries with state data (IN, US, GB, CA, AU, AE) */}
        {showStateDropdown && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              State / Region <span className="text-red-500">*</span>
            </label>
            <select
              {...register('state', {
                validate: (v) => !!v || 'Please select your state / region',
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select state…</option>
              {stateOptions.map((s) => (
                <option key={s.isoCode} value={s.name}>{s.name}</option>
              ))}
            </select>
            {errors.state && (
              <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
            )}
          </div>
        )}

        {/* Custom fields — "Location" excluded since country/state dropdowns replace it */}
        {webinar.custom_fields?.filter((f) => f.label.toLowerCase() !== 'location').map((field) => (
          <div key={field.id ?? field.label}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                {...register(`custom_${field.id}` as any, {
                  required: field.required ? 'Required' : false,
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select…</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(`custom_${field.id}` as any, {
                  required: field.required ? 'Required' : false,
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
        >
          {isSubmitting ? 'Registering…' : 'Register Now — It\'s Free'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function WebinarDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchWebinar = async () => {
      try {
        const res = await fetch(`/api/webinars/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setWebinar(json.webinar ?? json);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWebinar();
  }, [id]);

  if (isLoading) return <Spinner />;

  if (notFound || !webinar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
        <p className="text-gray-500 mb-8">
          This event may have been removed or the link is incorrect.
        </p>
        <Link
          href="/academy#special-events"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const youtubeId =
    webinar.media_type === 'youtube' && webinar.media_url
      ? extractYouTubeId(webinar.media_url)
      : null;

  return (
    <>
      <Head>
        <title>{webinar.title} | ITWala Academy</title>
        <meta name="description" content={webinar.description?.slice(0, 160)} />
        {webinar.banner_image && (
          <meta property="og:image" content={webinar.banner_image} />
        )}
      </Head>

      {/* ----------------------------------------------------------------- */}
      {/* A) Hero                                                            */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        {/* Background image + overlay */}
        {webinar.banner_image && (
          <>
            <Image
              src={normalizeImageSrc(webinar.banner_image)}
              alt={webinar.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary-700/80" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumb badge */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/academy#special-events"
              className="flex items-center gap-1 text-primary-200 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Events
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold uppercase tracking-widest bg-accent-500 text-white px-3 py-1 rounded-full">
              Special Event · Live Webinar
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl leading-tight"
          >
            {webinar.title}
          </motion.h1>

          {/* Meta pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Calendar className="w-4 h-4 text-accent-400" />
              {formatShortDateTime(webinar.date_time)}
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Clock className="w-4 h-4 text-accent-400" />
              {webinar.duration_minutes} min
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <SpeakerAvatar name={webinar.speaker_name} image={webinar.speaker_image} size="sm" />
              {webinar.speaker_name}
            </span>
          </motion.div>

          {/* CTA */}
          <motion.a
            href="#register-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base cursor-pointer"
          >
            Register Free
            <Users className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* B) Two-column layout                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left col */}
            <div className="flex-1 lg:w-7/12 space-y-10 min-w-0">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {webinar.description}
                </p>
              </motion.div>

              {/* Topics */}
              {webinar.topics && webinar.topics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Topics Covered</h2>
                  <ul className="space-y-2">
                    {webinar.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Learning outcomes */}
              {webinar.learning_outcomes && webinar.learning_outcomes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Learn</h2>
                  <ul className="space-y-2">
                    {webinar.learning_outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Speaker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Speaker</h2>
                <div className="bg-primary-50 rounded-2xl p-6 flex gap-5">
                  <SpeakerAvatar
                    name={webinar.speaker_name}
                    image={webinar.speaker_image}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{webinar.speaker_name}</h3>
                    {webinar.speaker_title && (
                      <p className="text-primary-600 text-sm mb-3">{webinar.speaker_title}</p>
                    )}
                    {webinar.speaker_bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {webinar.speaker_bio}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right col — sticky registration card */}
            <div className="lg:w-5/12 flex-shrink-0">
              <div className="sticky top-6">
                <RegistrationCard webinar={webinar} />

                {/* Event summary card */}
                <div className="mt-4 bg-primary-50 border border-primary-100 rounded-2xl p-5 text-sm text-gray-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>{formatDateTime(webinar.date_time)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>{webinar.duration_minutes} minutes</span>
                  </div>
                  {webinar.registration_limit && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span>Limited to {webinar.registration_limit} attendees</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* C) Media section                                                   */}
      {/* ----------------------------------------------------------------- */}
      {webinar.media_url && (
        <section className="bg-primary-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Event Recording</h2>

              {youtubeId ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={webinar.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : webinar.media_type === 'link' ? (
                <div className="text-center">
                  <a
                    href={webinar.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
                  >
                    Watch Recording
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
