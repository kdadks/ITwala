import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ContactInfo from '@/components/contact/ContactInfo';
import Faqs from '@/components/contact/Faqs';
import { courseData } from '@/data/courses';

const consultingServices = [
  "AI Powered Solutions",
  "Digital Transformation",
  "IT Staffing Partner",
  "Product Strategy & Development",
  "Technical Consulting",
  "Training & Development"
];

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service: string; // New field
  courseName?: string; // New field for Academy
  consultingType?: string; // New field for Consulting
}

const Contact: NextPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<ContactFormData>();
  const watchService = watch('service', selectedService);
  const courseOptions = courseData.map(course => course.title).sort();
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          toEmail: 'sales@it-wala.com',
          // Only send courseName or consultingType based on service
          courseName: data.service === 'Academy' ? data.courseName : undefined,
          consultingType: data.service === 'Consulting' ? data.consultingType : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Your message has been sent successfully!');
      reset(); // Reset the form fields
    } catch (error) {
      toast.error('There was an error sending your message. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - ITwala Academy</title>
        <meta name="description" content="Get in touch with ITwala Academy for more information about our courses, corporate training, or any other inquiries." />
      </Head>

      <main>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
              <p className="text-xl text-primary-100 mb-8">
                Have questions about our courses or need more information? Get in touch with our team.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="John Doe"
                          {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="you@example.com"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+91 9999999999"
                          {...register('phone')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <input
                          type="text"
                          id="subject"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Course Inquiry"
                          {...register('subject', { required: 'Subject is required' })}
                        />
                        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        id="message"
                        rows={5}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="How can we help you?"
                        {...register('message', { required: 'Message is required' })}
                      ></textarea>
                      {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                    </div>

                    {/* New Services Dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Services *</label>
                        <select
                          id="service"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('service', { required: 'Service is required' })}
                        >
                          <option value="">Select Service</option>
                          <option value="Academy">Academy</option>
                          <option value="Consulting">Consulting</option>
                        </select>
                        {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>}
                      </div>
                      {/* Conditional Field */}
                      {watchService === 'Academy' && (
                        <div>
                          <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                          <select
                            id="courseName"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.courseName ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('courseName', { required: 'Course name is required' })}
                          >
                            <option value="">Select Course</option>
                            {courseOptions.map(course => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                          </select>
                          {errors.courseName && <p className="mt-1 text-sm text-red-500">{errors.courseName.message}</p>}
                        </div>
                      )}
                      {watchService === 'Consulting' && (
                        <div>
                          <label htmlFor="consultingType" className="block text-sm font-medium text-gray-700 mb-1">Consulting Type *</label>
                          <select
                            id="consultingType"
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.consultingType ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('consultingType', { required: 'Consulting type is required' })}
                          >
                            <option value="">Select Consulting Service</option>
                            {consultingServices.sort().map(service => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                          {errors.consultingType && <p className="mt-1 text-sm text-red-500">{errors.consultingType.message}</p>}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>

              <ContactInfo />
            </div>
          </div>
        </section>

        <section className="mb-16 mt-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Locations</h2>
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.817036747081!2d80.9461593150447!3d26.8466939831587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2b0b0b0b0b0%3A0x0!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1684637298945!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <Faqs />
      </main>
    </>
  );
};

export default Contact;