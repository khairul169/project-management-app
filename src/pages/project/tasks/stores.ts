import { createStore } from "zustand";

type TaskModalStore = {
  isOpen: boolean;
  data: any;
};

export const taskModalStore = createStore<TaskModalStore>(() => ({
  isOpen: false,
  data: null,
}));
