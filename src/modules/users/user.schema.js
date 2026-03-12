import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url("Invalid URL for avatar.").optional(),
}).strict();

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url("Invalid URL for avatar.").optional(),
  xp: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
  circuit: z.number().int().min(0).optional(),
  is_verified: z.boolean().optional(),
}).strict();
