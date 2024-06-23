import { useStore } from "zustand";
import { produce } from "immer";
import { taskModalStore } from "./stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZodForm } from "@/hooks/useZodForm";
import { taskSchema } from "@/schema/project";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useProject } from "../components/context";
import { useDatabase } from "@/context/database";

const TaskModal = () => {
  const { data: project } = useProject();
  const db = useDatabase();
  const { isOpen, data } = useStore(taskModalStore);
  const form = useZodForm(taskSchema, data);

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { sectionId } = data;
      const tasks = produce(project.tasks, (tasks) => {
        const itemIdx = tasks[sectionId].items.findIndex(
          (item) => item.id === values.id
        );
        if (itemIdx !== -1) {
          tasks[sectionId].items[itemIdx] = values;
        } else {
          tasks[sectionId].items.push(values);
        }
      });

      await db.projects.put({ ...project, tasks });
      taskModalStore.setState({ isOpen: false });
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => taskModalStore.setState({ isOpen: false })}
    >
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{data?._rev ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>Add or edit a task.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Title" {...form.register("title")} />
          </div>

          <DialogFooter>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
