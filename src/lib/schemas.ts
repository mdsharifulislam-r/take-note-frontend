import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  interests: z.array(z.string()).optional(),
});

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  interests: z.array(z.string()).optional(),
});

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
  interests: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
  interests: z.array(z.string()).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type NoteFormData = z.infer<typeof noteSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
