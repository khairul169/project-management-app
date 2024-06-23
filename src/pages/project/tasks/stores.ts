import { Task } from "@/schema/project";
import { createStore } from "zustand";

type TaskModalStore = {
  isOpen: boolean;
  data: (Task & { sectionId: string }) | null;
};

export const taskModalStore = createStore<TaskModalStore>(() => ({
  isOpen: false,
  data: null,
}));
