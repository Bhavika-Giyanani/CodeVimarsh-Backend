import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url("Invalid URL for avatar.").optional(),
  })
  .strict();
