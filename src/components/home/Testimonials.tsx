import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
	{
		id: 1,
		name: 'Raahi Ventures',
		role: 'Founder, RaahiRides',
		image:
			'/images/raahi_rides_logo.png',
		quote:
			"ITWala transformed our vision of connecting travelers in Eastern UP into reality. Their expertise in building scalable travel apps with real-time GPS tracking and secure payment systems exceeded our expectations. We now serve 10,000+ active users seamlessly.",
		rating: 5,
	},
	{
		id: 2,
		name: 'Vishal Creations',
		role: 'Manufacturing Excellence',
		image:
			'/images/VC Logo.png',
		quote:
			"Working with ITWala on our Web Application was a game-changer. Their product development expertise helped us achieve a 40% increase in online orders and successfully serve 500+ B2B clients. Highly recommend their consulting services!",
		rating: 5,
	},
	{
		id: 3,
		name: 'Dr. Nidhi Sharma',
		role: 'Founder, Ayuh Clinic',
		image:
			'/images/AYUH_Logo_2.png',
		quote:
			"ITWala's healthcare solution expertise transformed our clinic's digital presence. The comprehensive booking system, patient management, and secure payment integration helped us serve 2,000+ patients with a 4.9/5 rating. Outstanding work!",
		rating: 5,
	},
	{
		id: 4,
		name: 'KH Therapy Center',
		role: 'Physiotherapy Excellence',
		image:
			'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
		quote:
			"ITWala built us a professional website that perfectly represents our physiotherapy services. With their custom designed fully automated Booking, Payment & Invoicing, we've successfully managed 1,500+ treatments with a 98% recovery rate. Excellent technical support!",
		rating: 5,
	},
	{
		id: 5,
		name: 'eYogi Gurukul',
		role: 'Education & Wellness Platform',
		image:
			'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
		quote:
			"ITWala's Next.js solution for our online education platform has been phenomenal. With features like live video classes, course management, and payment integration, we've grown to 3,000+ students across 100+ courses. Their technical expertise is unmatched!",
		rating: 5,
	},
	{
		id: 6,
		name: 'Luke Smith',
		role: 'Software Developer at TechCorp',
		image:
			'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			'The Java Programming Masterclass provided comprehensive knowledge and hands-on experience that helped me advance my career. The practical exercises and real-world projects made complex concepts easy to understand.',
		rating: 5,
	},
	{
		id: 7,
		name: 'Ankit Patel',
		role: 'AI Engineer at StartupX',
		image:
			'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			'The AI & Machine Learning Fundamentals course provided the perfect foundation for my career transition. I went from knowing basic Python to implementing complex AI models in just a few months.',
		rating: 5,
	},
];

const Testimonials = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrev = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
		);
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
		);
	};

	return (
		<section className="py-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						What Our Customers/Students Say
					</h2>
					<p className="text-xl text-primary-100 max-w-3xl mx-auto">
						Hear from our Customers/Students about how ITwala Academy & Consulting helped them advance
						their careers and transform their businesses.
					</p>
				</div>

				<div className="relative max-w-5xl mx-auto">
					<button
						onClick={handlePrev}
						className="absolute top-1/2 -left-5 md:-left-12 transform -translate-y-1/2 bg-white text-primary-600 p-3 rounded-full shadow-lg hover:bg-gray-100 z-10"
						aria-label="Previous testimonial"
					>
						<FaChevronLeft className="w-5 h-5" />
					</button>

					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.3 }}
							className="bg-white rounded-xl shadow-xl text-gray-900 p-8 md:p-12"
						>
							<div className="flex flex-col md:flex-row items-center">
								<div className="mb-6 md:mb-0 md:mr-8">
									<div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary-100">
										<img
											src={testimonials[currentIndex].image}
											alt={testimonials[currentIndex].name}
											className="w-full h-full object-cover"
										/>
									</div>
								</div>

								<div className="flex-1">
									<FaQuoteLeft className="text-primary-300 w-8 h-8 mb-4" />
									<blockquote className="text-lg md:text-xl mb-6 italic">
										{testimonials[currentIndex].quote}
									</blockquote>

									<div className="flex items-center mb-2">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												className={`w-5 h-5 ${
													i < testimonials[currentIndex].rating
														? 'text-yellow-400'
														: 'text-gray-300'
												}`}
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>

									<footer>
										<div className="font-bold text-lg">
											{testimonials[currentIndex].name}
										</div>
										<div className="text-gray-600">
											{testimonials[currentIndex].role}
										</div>
									</footer>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					<button
						onClick={handleNext}
						className="absolute top-1/2 -right-5 md:-right-12 transform -translate-y-1/2 bg-white text-primary-600 p-3 rounded-full shadow-lg hover:bg-gray-100 z-10"
						aria-label="Next testimonial"
					>
						<FaChevronRight className="w-5 h-5" />
					</button>

					<div className="flex justify-center mt-8 space-x-2">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-3 h-3 rounded-full transition-colors ${
									index === currentIndex
										? 'bg-white'
										: 'bg-white/50 hover:bg-white/80'
								}`}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;