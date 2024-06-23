import {
  InferCreateSchema,
  InferSchema,
  createDbSchema,
  curTimestamp,
  generateId,
} from "@/lib/utils";
import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
});

const taskSectionSchema = z.object({
  id: z.string(),
  section: z.string(),
  items: taskSchema.array(),
});

type TaskSection = InferSchema<typeof taskSectionSchema>;

export type ProjectTasks = Array<TaskSection>;

const initialTasks = () => {
  return [
    {
      id: generateId(),
      section: "Todo",
      items: [{ id: generateId(), title: "Untitled Task" }],
    },
    {
      id: generateId(),
      section: "In Progress",
      items: [],
    },
    {
      id: generateId(),
      section: "Done",
      items: [],
    },
    {
      id: generateId(),
      section: "Archived",
      items: [],
    },
  ] satisfies TaskSection[];
};

export const projectSchema = createDbSchema({
  title: z.string().min(1),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tasks: taskSectionSchema.array(),
});

export type Project = InferSchema<typeof projectSchema>;

export const initialProject = () => {
  return {
    _id: generateId(),
    title: "Untitled Project",
    content: "",
    createdAt: curTimestamp(),
    updatedAt: curTimestamp(),
    tasks: initialTasks(),
  } satisfies InferCreateSchema<typeof projectSchema>;
};
