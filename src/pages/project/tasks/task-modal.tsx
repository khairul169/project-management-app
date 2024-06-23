import { useStore } from "zustand";
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
import { taskSchema } from "@/schema/task";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useDatabase } from "@/context/database";
import FormControl from "@/components/ui/form-control";
import { Textarea } from "@/components/ui/textarea";

const TaskModal = () => {
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
      if (values.index < 0) {
        const lastIndex = await db.tasks
          .find({
            selector: { index: { $gt: null }, sectionId: values.sectionId },
            fields: ["index"],
            sort: [{ index: "desc" }],
          })
          .then((i) => i.docs[0]?.index ?? -1);
        values.index = lastIndex + 1;
      }

      // Store task in database
      await db.tasks.put(values);

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
