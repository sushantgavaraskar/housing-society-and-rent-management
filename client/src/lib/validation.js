import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  role: z.enum(["admin", "owner", "tenant"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
