import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Webinar {
  id: string;
  title: string;
  slug: string;
  date_time: string;
  duration_minutes: number;
  speaker_name?: string;
  speaker_title?: string;
  speaker_image?: string;
  banner_image?: string;
  topics?: string[];
  registration_limit?: number;
}

function normalizeImageSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src;
  const clean = src.startsWith('public/') ? src.slice(7) : src;
  return `/${clean}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function SpeakerInitials({ name, image }: { name?: string; image?: string }) {
  const initials = (name ?? '')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  if (image) {
    return (
      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
        <Image src={normalizeImageSrc(image)} alt={name ?? ''} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[8px] font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function EventCard({ webinar, index }: { webinar: Webinar; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      className="flex-shrink-0 w-[272px]"
    >
      <Link href={`/events/${webinar.id}`} className="block group">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-shadow duration-300 overflow-hidden">
          {/* Thumbnail — no absolute children so nothing can overlap */}
          <div className="relative h-28 w-full bg-gradient-to-br from-primary-600 to-primary-800">
            {webinar.banner_image && (
              <Image
                src={normalizeImageSrc(webinar.banner_image)}
                alt={webinar.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Card body — all in normal flow */}
          <div className="p-4 space-y-2.5">
            {/* Badge row */}
            <div className="flex items-center gap-2">
              <span className="bg-accent-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                Live
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {webinar.duration_minutes} min · Free
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
              {webinar.title}
            </h3>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Calendar className="w-3 h-3 text-primary-500 flex-shrink-0" />
              <span className="truncate">{formatDate(webinar.date_time)}</span>
            </div>

            {/* Speaker + CTA */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              {webinar.speaker_name ? (
                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 min-w-0">
                  <SpeakerInitials name={webinar.speaker_name} image={webinar.speaker_image} />
                  <span className="truncate font-medium">{webinar.speaker_name}</span>
                </div>
              ) : (
                <span />
              )}
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-accent-500 group-hover:gap-1.5 transition-all duration-200 flex-shrink-0 ml-2">
                Register
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[272px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-4 w-10 bg-gray-200 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function SpecialEvents() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          .slice(0, 6);
        setWebinars(upcoming);
      } catch {
        // Silently fail — section simply won't show
      } finally {
        setIsLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  if (!isLoading && webinars.length === 0) return null;

  return (
    // Pulled up over the hero bottom edge; z-10 keeps cards above adjacent sections
    <div className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-500">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
          Live Events
        </span>
        <div className="flex-1 h-px bg-gray-200/70" />
        <Link
          href="/academy#special-events"
          className="text-[11px] text-primary-500 hover:text-primary-700 font-medium transition-colors whitespace-nowrap"
        >
          View all →
        </Link>
      </div>

      {/* Horizontal scroll row — no background, pure cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : webinars.map((webinar, i) => (
              <EventCard key={webinar.id} webinar={webinar} index={i} />
            ))}
      </div>
    </div>
  );
}
