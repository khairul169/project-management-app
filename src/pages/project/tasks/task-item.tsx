import { NotepadText } from "lucide-react";
import { taskModalStore } from "./stores";
import { Task } from "@/schema/task";

type TaskItemProps = {
  sectionId: string;
  data: Task;
};

const TaskItem = ({ sectionId, data }: TaskItemProps) => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.setData("id", data._id);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    taskModalStore.setState({ isOpen: true, data });
  };
  return (
    <div
      className={
        "border rounded-md p-4 hover:bg-muted/40 transition-colors cursor-pointer"
      }
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <NotepadText className="text-muted-foreground" size={24} />
      <p className="mt-2">{data.title}</p>
      {data.description && (
        <p className="text-sm text-muted-foreground truncate">
          {data.description}
        </p>
      )}
    </div>
  );
};

export default TaskItem;
