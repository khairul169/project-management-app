import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/button";
import { TaskSection as TaskSectionType } from "@/schema/project";
import { Badge } from "@/components/ui/badge";
import { useTaskListQuery } from "./queries";
import TaskList from "./task-list";

type TaskSectionProps = {
  data: TaskSectionType;
  onAddTask: () => void;
  onTaskMove: (
    sectionId: string,
    id: string,
    toSectionId: string,
    toIndex?: number
  ) => void;
};

const TaskSection = ({ data, onAddTask, onTaskMove }: TaskSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const tasks = useTaskListQuery(data.id);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const srcSectionId = e.dataTransfer.getData("sectionId");
    const id = e.dataTransfer.getData("id");
    const container = containerRef.current;

    if (!srcSectionId || !id || !container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const y = e.clientY - containerRect.top;
    const itemHeight =
      (container.firstChild as HTMLDivElement)?.getBoundingClientRect()
        .height || 96;
    const index = Math.max(0, Math.floor(y / itemHeight));

    onTaskMove(srcSectionId, id, data.id, index);
  };

  return (
    <div
      className={cn(
        "w-[240px] rounded-md shrink-0 min-h-full group pb-4 transition-colors",
        isDragging && "bg-muted/30"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className="bg-muted/50 rounded-md px-6 h-10 text-center flex items-center justify-center gap-2 sticky top-0"
        style={{ backgroundColor: data.color }}
      >
        <p className="truncate text-sm text-white">{data.label}</p>

        {tasks?.length > 0 && (
          <Badge variant="secondary" className="px-1.5 py-0 -mr-4">
            {tasks?.length}
          </Badge>
        )}

        <IconButton
          icon={<Plus />}
          onClick={onAddTask}
          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 !text-white hover:bg-foreground/30"
        />
      </div>

      <TaskList ref={containerRef} tasks={tasks} onAddTask={onAddTask} />
    </div>
  );
};

export default TaskSection;
