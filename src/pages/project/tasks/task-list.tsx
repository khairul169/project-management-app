import { forwardRef } from "react";
import { useTaskListQuery } from "./queries";
import TaskItem from "./task-item";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type TaskListProps = {
  tasks: ReturnType<typeof useTaskListQuery>;
  onAddTask: () => void;
};

const TaskList = forwardRef<HTMLDivElement, TaskListProps>(
  ({ tasks, onAddTask }, ref) => {
    return (
      <div ref={ref as never} className="space-y-3 w-full mt-3 pb-4">
        {tasks?.map((item) => (
          <TaskItem key={item._id} sectionId={item.sectionId} data={item} />
        ))}

        <Button
          onClick={onAddTask}
          className={cn(
            "w-full gap-3",
            tasks?.length > 0 &&
              "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
          size="sm"
          variant="outline"
        >
          <Plus size={16} />
          Add Task
        </Button>
      </div>
    );
  }
);

export default TaskList;
