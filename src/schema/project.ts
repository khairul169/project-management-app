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
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = InferSchema<typeof taskSchema>;

const taskSectionSchema = z.object({
  id: z.string(),
  section: z.string(),
  color: z.string(),
  items: taskSchema.array(),
});

export type TaskSection = InferSchema<typeof taskSectionSchema>;
export type ProjectTasks = Array<TaskSection>;

const initialTasks = () => {
  return [
    {
      id: generateId(),
      section: "Todo",
      color: "#4b57c9",
      items: [
        {
          id: generateId(),
          title: "Untitled Task",
          description: "My first task",
          createdAt: curTimestamp(),
          updatedAt: curTimestamp(),
        },
      ],
    },
    {
      id: generateId(),
      section: "In Progress",
      color: "#f5a623",
      items: [],
    },
    {
      id: generateId(),
      section: "Done",
      color: "#4caf50",
      items: [],
    },
    {
      id: generateId(),
      section: "Archived",
      color: "#9e9e9e",
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
