import { InferCreateSchema, createDbSchema } from "@/lib/utils";
import { z } from "zod";

export const taskSchema = createDbSchema({
  projectId: z.string(),
  sectionId: z.string(),
  title: z.string().min(1),
  index: z.number(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = InferCreateSchema<typeof taskSchema>;
