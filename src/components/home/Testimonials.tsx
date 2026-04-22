import Image from 'next/image';

interface Testimonial {
	id: number;
	name: string;
	role: string;
	image: string;
	quote: string;
	rating: number;
	metric: string;
	metricLabel: string;
}

const testimonials: Testimonial[] = [
	{
		id: 1,
		name: 'RaahiRides',
		role: 'Travel & Ride-Sharing Platform',
		image: '/images/raahi_rides_logo.png',
		quote:
			'ITWala transformed our vision of connecting travelers in Eastern UP into reality. Real-time GPS tracking, secure payments, and driver verification — delivered beyond expectations.',
		rating: 5,
		metric: '10,000+',
		metricLabel: 'Active Users',
	},
	{
		id: 2,
		name: 'Vishal Creations',
		role: 'Manufacturing & B2B Supply',
		image: '/images/VC Logo.png',
		quote:
			'Their product development expertise helped us achieve a 40% increase in online orders and successfully serve 500+ B2B clients. A true game-changer for our business.',
		rating: 5,
		metric: '+40%',
		metricLabel: 'Online Orders',
	},
	{
		id: 3,
		name: 'How2doAI',
		role: 'AI Tools Discovery Platform',
		image: '/images/logo.png',
		quote:
			'ITWala built an incredible AI app finder and comparison platform. From cataloguing 1,000+ tools to workflow automation guides — the quality and speed of delivery was outstanding.',
		rating: 5,
		metric: '5,000+',
		metricLabel: 'Monthly Visitors',
	},
	{
		id: 4,
		name: 'Ayuh Clinic',
		role: 'Healthcare & Homeopathy',
		image: '/images/AYUH_Logo_2.png',
		quote:
			"ITWala's healthcare solution transformed our clinic's digital presence. The booking system, patient management, and payment integration helped us serve 2,000+ patients with a 4.9/5 rating.",
		rating: 5,
		metric: '4.9/5',
		metricLabel: 'Patient Rating',
	},
	{
		id: 5,
		name: 'KH Therapy',
		role: 'Physiotherapy Clinic, Ireland',
		image: '/images/KH.png',
		quote:
			"ITWala built us a professional site with fully automated Booking, Payment & Invoicing. We've successfully managed 1,500+ treatments with a 98% recovery rate. Excellent technical support!",
		rating: 5,
		metric: '98%',
		metricLabel: 'Recovery Rate',
	},
	{
		id: 6,
		name: 'Nirchal',
		role: 'Retail Garments & E-Commerce',
		image: '/images/Nirchal_Logo.png',
		quote:
			'ITWala delivered a seamless e-commerce platform for our garments store. The shopping experience, inventory management, and fast checkout have driven 5,000+ product sales and strong daily orders.',
		rating: 5,
		metric: '5,000+',
		metricLabel: 'Products Sold',
	},
	{
		id: 7,
		name: 'eYogi Gurukul',
		role: 'Education & Wellness Platform',
		image: '/images/eyogiLogo.png',
		quote:
			"ITWala's Next.js solution has been phenomenal. With live video classes, course management, and payment integration, we've grown to 1,000+ students across 13+ courses with 85% completion.",
		rating: 5,
		metric: '85%',
		metricLabel: 'Course Completion',
	},
	{
		id: 8,
		name: 'Pandit Rajesh Joshi',
		role: 'Spiritual & Religious Services',
		image: '/images/Raj ji.svg',
		quote:
			'ITWala created a dignified platform that truly reflects our spiritual mission. The booking system and live session integration helped us conduct 250+ Poojas with a perfect 5.0/5 rating.',
		rating: 5,
		metric: '250+',
		metricLabel: 'Poojas Conducted',
	},
	{
		id: 9,
		name: 'Adamstown.info',
		role: 'Digital Media & Local Platform',
		image: '/images/adam.jpeg',
		quote:
			'A full-stack product built, hosted, and operated in-house by ITWala — end-to-end product ownership from development and SEO to content strategy. Now ranking Top 3 with 1,000+ monthly visitors.',
		rating: 5,
		metric: 'Top 3',
		metricLabel: 'Search Rankings',
	},
	{
		id: 10,
		name: 'UK Knee & Sports Clinic',
		role: 'Healthcare SEO, United Kingdom',
		image: '/images/UK.jpg',
		quote:
			'ITWala delivered a comprehensive SEO program — technical audits, on-page optimisation, local SEO, and content strategy. Organic traffic jumped 60% and patient enquiries increased by 40%.',
		rating: 5,
		metric: '+60%',
		metricLabel: 'Organic Traffic',
	},
	{
		id: 11,
		name: 'Luke Smith',
		role: 'Software Developer, TechCorp',
		image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
		quote:
			'The Java Programming Masterclass gave me comprehensive knowledge and hands-on experience. The real-world projects made complex concepts easy to understand — helped me land a better role.',
		rating: 5,
		metric: '3x',
		metricLabel: 'Salary Growth',
	},
	{
		id: 12,
		name: 'Ankit Patel',
		role: 'AI Engineer, StartupX',
		image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
		quote:
			'The AI & Machine Learning course gave me the perfect foundation for my career transition. I went from basic Python to implementing production-grade AI models in just 6 months.',
		rating: 5,
		metric: '6 mo',
		metricLabel: 'To First AI Role',
	},
];

const StarRating = ({ rating }: { rating: number }) => (
	<div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
		{[...Array(5)].map((_, i) => (
			<svg
				key={i}
				className={`w-3.5 h-3.5 ${i < rating ? 'text-accent-500' : 'text-gray-300'}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-hidden="true"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		))}
	</div>
);

const TestimonialCard = ({ t }: { t: Testimonial }) => (
	<div className="flex-shrink-0 w-[340px] sm:w-[380px] mx-3 bg-white rounded-2xl border border-primary-100 shadow-md hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden">
		{/* Top accent stripe */}
		<div className="h-1 w-full bg-gradient-to-r from-primary-500 to-secondary-500" />

		<div className="p-6">
			{/* Quote icon */}
			<svg
				className="w-7 h-7 text-primary-200 mb-3"
				fill="currentColor"
				viewBox="0 0 32 32"
				aria-hidden="true"
			>
				<path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
			</svg>

			{/* Quote text */}
			<blockquote className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
				{t.quote}
			</blockquote>

			{/* Metric + stars row */}
			<div className="flex items-center justify-between mb-5">
				<div className="bg-primary-50 border border-primary-100 rounded-lg px-3 py-1.5">
					<span className="text-lg font-bold text-primary-600 leading-none block">{t.metric}</span>
					<span className="text-[10px] uppercase tracking-wider text-primary-400 mt-0.5 block">{t.metricLabel}</span>
				</div>
				<StarRating rating={t.rating} />
			</div>

			{/* Author row */}
			<div className="flex items-center gap-3 pt-4 border-t border-gray-100">
				<div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100 flex-shrink-0 bg-gray-100">
					<Image
						src={t.image}
						alt={t.name}
						fill
						sizes="40px"
						className="object-cover"
					/>
				</div>
				<div>
					<div className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</div>
					<div className="text-gray-400 text-xs mt-0.5">{t.role}</div>
				</div>
			</div>
		</div>
	</div>
);

const Testimonials = () => {
	// Duplicate for seamless infinite loop
	const doubled = [...testimonials, ...testimonials];

	return (
		<section className="relative pt-10 pb-11 md:pt-14 md:pb-16 overflow-hidden bg-gray-50">
			<div className="absolute inset-x-0 top-0 h-px bg-gray-200" aria-hidden="true" />
			<div className="absolute inset-x-0 bottom-0 h-px bg-gray-200" aria-hidden="true" />

			<style>{`
				@keyframes marquee-rtl {
					0%   { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.marquee-track {
					animation: marquee-rtl 50s linear infinite;
					will-change: transform;
				}
				.marquee-track:hover {
					animation-play-state: paused;
				}
				/* Mobile: disable auto-scroll, use native touch scroll */
				@media (max-width: 767px) {
					.marquee-track {
						animation: none;
						will-change: auto;
					}
					.marquee-mobile-scroll {
						overflow-x: auto;
						-webkit-overflow-scrolling: touch;
						scroll-snap-type: x mandatory;
						scrollbar-width: none;
					}
					.marquee-mobile-scroll::-webkit-scrollbar {
						display: none;
					}
					.marquee-card-snap {
						scroll-snap-align: start;
					}
				}
			`}</style>

			<div className="container mx-auto px-4 mb-12">
				{/* Section header */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
						<span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
						Client Success Stories
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
						What Our Clients &{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
							Students Say
						</span>
					</h2>
					<p className="text-gray-500 text-lg max-w-2xl mx-auto">
						Real outcomes delivered to enterprise clients and learners across 7+ industries worldwide.
					</p>
				</div>
			</div>

			{/* Marquee — full bleed outside container */}
			<div className="relative">
				{/* Left fade (desktop only) */}
				<div
					className="hidden md:block absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
					style={{ background: 'linear-gradient(to right, #f9fafb, transparent)' }}
					aria-hidden="true"
				/>
				{/* Right fade (desktop only) */}
				<div
					className="hidden md:block absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
					style={{ background: 'linear-gradient(to left, #f9fafb, transparent)' }}
					aria-hidden="true"
				/>

				{/* Desktop: infinite auto-scroll marquee */}
				<div className="hidden md:block overflow-hidden">
					<div className="marquee-track flex py-3 items-stretch">
						{doubled.map((t, idx) => (
							<TestimonialCard key={`${t.id}-${idx}`} t={t} />
						))}
					</div>
				</div>

				{/* Mobile: touch-swipe scroll with snap */}
				<div className="md:hidden marquee-mobile-scroll px-4">
					<div className="flex py-3 items-stretch">
						{testimonials.map((t) => (
							<div key={t.id} className="marquee-card-snap">
								<TestimonialCard t={t} />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;