import { Task } from "@/schema/task";
import { createStore } from "zustand";

type TaskModalStore = {
  isOpen: boolean;
  data: Task | null;
};

export const taskModalStore = createStore<TaskModalStore>(() => ({
  isOpen: false,
  data: null,
}));
