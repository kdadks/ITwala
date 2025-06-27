// (Component removed from home page, safe to delete or keep for future use)

import { motion } from 'framer-motion';
import { FaUserGraduate, FaLaptopCode, FaUsers, FaBriefcase, FaProjectDiagram, FaTrophy } from 'react-icons/fa';
import { allCourses as courseData } from '@/data/allCourses';

const keyConsultingStats = [
	{
		icon: <FaProjectDiagram className="w-8 h-8" />,
		value: '20+',
		label: 'Projects Delivered',
		color: 'from-blue-700 to-blue-700',
		ring: 'ring-blue-500/30',
	},
	{
		icon: <FaTrophy className="w-8 h-8" />,
		value: '98%',
		label: 'Client Satisfaction',
		color: 'from-yellow-600 to-yellow-600',
		ring: 'ring-yellow-500/30',
	},
];

const stats = [
	{
		icon: <FaUserGraduate className="w-8 h-8" />,
		value: '500+',
		label: 'Students Enrolled',
		color: 'from-primary-600 to-primary-600',
		ring: 'ring-primary-500/30',
	},
	{
		icon: <FaLaptopCode className="w-8 h-8" />,
		value: `${courseData.length}+`,
		label: 'Specialized Courses',
		color: 'from-secondary-700 to-secondary-700',
		ring: 'ring-secondary-500/30',
	},
	{
		icon: <FaUsers className="w-8 h-8" />,
		value: '20+',
		label: 'Learning Tracks',
		color: 'from-accent-700 to-accent-700',
		ring: 'ring-accent-500/30',
	},
	{
		icon: <FaBriefcase className="w-8 h-8" />,
		value: '80%',
		label: 'Job Placement Rate',
		color: 'from-success-500 to-success-400',
		ring: 'ring-success-500/30',
	},
	...keyConsultingStats,
];

const Stats = () => {
	return (
		<section className="py-20 bg-green-800 text-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-14">
					<h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
						Impact in Numbers
					</h2>
					<p className="text-lg md:text-xl text-white-400 max-w-2xl mx-auto">
						Our commitment to quality education has made a real difference
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					{stats.map((stat, idx) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								delay: idx * 0.1,
								duration: 0.6,
								type: 'spring',
							}}
							className={`relative group bg-green-800 ${stat.ring} rounded-2xl p-8 shadow-xl overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl border border-green-700 hover:border-green-500 ring-1`}
						>
							<div className={`flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg border border-white/10 group-hover:scale-110 transition-transform`}>
								{stat.icon}
							</div>
							<div className="text-5xl font-extrabold mb-2 drop-shadow-lg text-white">
								{stat.value}
							</div>
							<div className="text-gray-100 text-lg font-medium tracking-wide">
								{stat.label}
							</div>
							<div className="absolute -top-8 -right-8 opacity-10 text-white text-[7rem] pointer-events-none select-none">
								{stat.icon}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Stats;