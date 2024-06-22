import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  _rev: z.string().nullish(),
});

export type Project = z.infer<typeof projectSchema> & { _id: string };
