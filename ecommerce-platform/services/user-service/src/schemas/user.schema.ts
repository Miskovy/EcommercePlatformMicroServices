import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]).optional() 
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});