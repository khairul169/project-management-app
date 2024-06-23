import {
  InferCreateSchema,
  InferSchema,
  createDbSchema,
  curTimestamp,
  generateId,
} from "@/lib/utils";
import { z } from "zod";

export const taskSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
});

export type TaskSection = InferSchema<typeof taskSectionSchema>;

export const projectSchema = createDbSchema({
  title: z.string().min(1),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  taskSections: taskSectionSchema.array(),
});

export type Project = InferSchema<typeof projectSchema>;

const initialTaskSections = () => {
  return [
    {
      id: generateId(),
      label: "Todo",
      color: "#4b57c9",
    },
    {
      id: generateId(),
      label: "In Progress",
      color: "#f5a623",
    },
    {
      id: generateId(),
      label: "Done",
      color: "#4caf50",
    },
    {
      id: generateId(),
      label: "Archived",
      color: "#9e9e9e",
    },
  ] satisfies TaskSection[];
};

export const initialProject = () => {
  return {
    _id: generateId(),
    title: "Untitled Project",
    content: "",
    createdAt: curTimestamp(),
    updatedAt: curTimestamp(),
    taskSections: initialTaskSections(),
  } satisfies InferCreateSchema<typeof projectSchema>;
};
