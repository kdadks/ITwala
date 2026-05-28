import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Students Enrolled' },
  { value: '98%',  label: 'Satisfaction Rate'  },
  { value: '8+',   label: 'Batches Delivered'  },
];

interface Webinar {
  id: string;
  title: string;
  date_time: string;
  duration_minutes: number;
  speaker_name?: string;
  banner_image?: string;
}

function normalizeImage(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src;
  const clean = src.startsWith('public/') ? src.slice(7) : src;
  return `/${clean}`;
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function EventCard({ webinar }: { webinar: Webinar }) {
  return (
    <Link href={`/events/${webinar.id}`} className="block group">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Thumbnail */}
        {webinar.banner_image ? (
          <div className="relative h-24 w-full">
            <Image
              src={normalizeImage(webinar.banner_image)}
              alt={webinar.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary-900/30" />
          </div>
        ) : (
          <div className="h-24 w-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary-200 opacity-40" />
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4">
          {/* Badge + duration */}
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 bg-accent-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Live
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {webinar.duration_minutes} min · Free
            </span>
          </div>

          {/* Accent rule — matches stat card style */}
          <div className="w-6 h-[3px] bg-primary-500 rounded-full mb-2" />

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {webinar.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
            <Calendar className="w-3 h-3 text-primary-500 flex-shrink-0" />
            <span className="truncate">{formatEventDate(webinar.date_time)}</span>
          </div>

          {/* CTA */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-500 group-hover:gap-2 transition-all duration-200">
            Register Free
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="px-5 py-4 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-10 bg-gray-200 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-[3px] w-6 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

const Hero = () => {
  const [courseCount, setCourseCount] = useState<string>('8+');
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [webinarsLoading, setWebinarsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const { courses } = await response.json();
          setCourseCount(`${courses.length}+`);
        }
      } catch {
        setCourseCount('8+');
      }
    };

    const fetchWebinars = async () => {
      try {
        const res = await fetch('/api/webinars');
        if (!res.ok) return;
        const json = await res.json();
        const data: Webinar[] = Array.isArray(json) ? json : (json.webinars ?? []);
        const now = Date.now();
        const upcoming = data
          .filter((w) => new Date(w.date_time).getTime() > now)
          .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
          .slice(0, 2);
        setWebinars(upcoming);
      } catch {
        // fall back to stats silently
      } finally {
        setWebinarsLoading(false);
      }
    };

    fetchCourseCount();
    fetchWebinars();
  }, []);

  const showEvents = !webinarsLoading && webinars.length > 0;
  const showSkeleton = webinarsLoading;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />

      {/* Vertical accent rule (desktop) */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-12 lg:pt-14 lg:pb-14 w-full">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-primary-500 shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                AI &amp; Web Technology · Education &amp; Consulting
              </span>
            </div>

            <h1 className="font-serif text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.06] text-gray-900 mb-5">
              Transform Your Future with{' '}
              <span className="text-gradient">IT Excellence</span>
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
              <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                IT — It&apos;s Simple
                <span className="text-gray-400 font-normal"> · Let us shape your career &amp; business</span>
              </p>
            </div>

            <p className="text-[0.94rem] text-gray-500 leading-[1.85] max-w-[480px] mb-10">
              Master cutting-edge technologies with industry experts and hands-on projects.
              Accelerate your business with our proven consulting solutions.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/courses">
                <span className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Get Started
                </span>
              </Link>
              <Link href="/courses">
                <span className="inline-flex items-center gap-1.5 h-12 px-5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all duration-200">
                  Explore Courses →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── Right: Events (when available) + Stats always ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            {/* Upcoming event — shown while loading or when events exist */}
            {(showSkeleton || showEvents) && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                    Upcoming Live Event
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                  {!showSkeleton && webinars.length > 1 && (
                    <Link href="/academy" className="text-[10px] text-primary-500 hover:text-primary-700 font-medium whitespace-nowrap transition-colors">
                      +{webinars.length - 1} more →
                    </Link>
                  )}
                </div>
                {showSkeleton ? <EventCardSkeleton /> : <EventCard webinar={webinars[0]} />}
              </div>
            )}

            {/* Stats grid — always shown */}
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              {[...stats, { value: courseCount, label: 'Specialized Courses' }].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 flex flex-col justify-between${i === 3 ? ' col-span-2' : ''}`}
                >
                  <div className="w-6 h-[3px] bg-primary-500 rounded-full mb-3" />
                  <div className="text-[2rem] font-bold text-gray-900 leading-none tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
