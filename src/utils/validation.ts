import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  toEmail: z.string().email('Invalid recipient email')
});

export const enrollmentSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  userDetails: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    addressLine1: z.string().max(200).optional(),
    addressLine2: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    pincode: z.string().max(20).optional(),
    dateOfBirth: z.string().max(20).optional(),
    highestQualification: z.string().max(100).optional(),
    degreeName: z.string().max(100).optional(),
    hasLaptop: z.boolean().optional()
  }).optional(),
  directEnrollment: z.boolean().optional()
});

export const notifySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  courseId: z.string().uuid('Invalid course ID'),
  name: z.string().min(1).max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(20).optional()
});

export const studentCreateSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  phone: z.string().max(20).optional(),
  date_of_birth: z.string().max(20).optional(),
  parent_name: z.string().max(100).optional(),
  highest_qualification: z.string().max(100).optional(),
  address_line1: z.string().max(200).optional(),
  address_line2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  courseIds: z.array(z.string().uuid()).optional()
});

export const webinarRegisterSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Invalid international phone number'),
  organization: z.string().max(100).optional(),
  job_title: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  custom_answers: z.any().optional()
});

export const courseUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format').optional(),
  description: z.string().max(10000).optional(),
  category: z.string().max(100).optional(),
  image: z.string().url().optional(),
  price: z.number().positive().optional(),
  original_price: z.number().positive().optional(),
  level: z.string().max(50).optional(),
  duration: z.string().max(50).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  learning_outcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().max(50).optional(),
  certification_included: z.boolean().optional(),
  fees_discussed_post_enrollment: z.boolean().optional(),
  modules: z.array(z.any()).optional()
});

export const uploadImageSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  base64: z.string().min(1, 'Base64 data is required'),
  contentType: z.string().startsWith('image/'),
  filename: z.string().max(255).optional()
});

export const studentUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  date_of_birth: z.string().max(20).optional(),
  parent_name: z.string().max(100).optional(),
  highest_qualification: z.string().max(100).optional(),
  address_line1: z.string().max(200).optional(),
  address_line2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  pincode: z.string().max(20).optional()
});
