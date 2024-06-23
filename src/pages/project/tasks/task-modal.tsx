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
import FormControl from "@/components/ui/form-control";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";

const TaskModal = () => {
  const { data: project } = useProject();
  const db = useDatabase();
  const { isOpen, data } = useStore(taskModalStore);
  const form = useZodForm(taskSchema);

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!data) {
      return null;
    }

    try {
      const { sectionId } = data;
      const tasks = produce(project.tasks, (tasks) => {
        const section = tasks.find((i) => i.id === sectionId);
        if (!section) {
          return;
        }

        if (!values.id?.length) {
          values.id = generateId();
        }

        const itemIdx = section.items.findIndex(
          (item) => item.id === values.id
        );

        if (itemIdx !== -1) {
          section.items[itemIdx] = values;
        } else {
          section.items.push(values);
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
            <DialogTitle>{data?.id ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>Add or edit a task.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormControl
              label="Title"
              form={form}
              name="title"
              render={(field) => (
                <Input placeholder="Task Title..." {...field} />
              )}
            />
            <FormControl
              label="Description"
              form={form}
              name="description"
              render={(field) => (
                <Textarea placeholder="Write description here..." {...field} />
              )}
            />
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
