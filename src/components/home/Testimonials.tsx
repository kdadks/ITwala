import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
	{
		id: 1,
		name: 'Luke Smith',
		role: 'Software Developer at TechCorp',
		image:
			'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			'The Java Programming Masterclass provided comprehensive knowledge and hands-on experience that helped me advance my career. The practical exercises and real-world projects made complex concepts easy to understand.',
		rating: 5,
	},
	{
		id: 2,
		name: 'Jenny Kim',
		role: 'Product Manager at RealTech',
		image:
			'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			"ITwala Academy's Product Management course transformed my approach to building digital products. The real-world examples and practical assignments prepared me for my daily work.",
		rating: 5,
	},
	{
		id: 3,
		name: 'Ankit Patel',
		role: 'AI Engineer at StartupX',
		image:
			'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			'The AI & Machine Learning Fundamentals course provided the perfect foundation for my career transition. I went from knowing basic Python to implementing complex AI models in just a few months.',
		rating: 4,
	},
	{
		id: 4,
		name: 'Sonal Mehra',
		role: 'Consultant, Digital Transformation',
		image:
			'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		quote:
			"The consulting sessions with ITwala Consulting were invaluable for our business. Their expert advice on digital strategy and technology implementation helped us streamline operations and achieve measurable growth.",
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
		<section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						What Our Students Say
					</h2>
					<p className="text-xl text-primary-100 max-w-3xl mx-auto">
						Hear from our students about how ITwala Academy helped them advance
						their careers
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