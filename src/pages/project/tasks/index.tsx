import { NotepadText, Plus } from "lucide-react";
import { useProject } from "../components/context";
import { useState } from "react";
import { produce } from "immer";
import { cn, generateId } from "@/lib/utils";
import { ProjectTasks } from "@/schema/project";
import { useDatabase } from "@/context/database";
import TaskModal from "./task-modal";
import { IconButton } from "@/components/ui/button";
import { taskModalStore } from "./stores";

const TasksPage = () => {
  const { data } = useProject();
  const db = useDatabase();
  const tasks = data.tasks;

  const setTasks = async (tasks: ProjectTasks) => {
    try {
      await db.projects.put({ ...data, tasks });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex-1 flex overflow-auto gap-x-4">
        {tasks?.map((task, idx) => (
          <TaskSection
            key={task.section}
            sectionId={idx}
            title={task.section}
            tasks={tasks}
            setTasks={setTasks}
          >
            {task.items?.map((item) => (
              <TaskItem
                key={item.id}
                sectionId={idx}
                id={item.id}
                title={item.title}
              />
            ))}
          </TaskSection>
        ))}
      </div>

      <TaskModal />
    </>
  );
};

type TaskSectionProps = {
  sectionId: number;
  title: string;
  children?: React.ReactNode;
  tasks: ProjectTasks;
  setTasks: (tasks: ProjectTasks) => Promise<void>;
};

const TaskSection = ({
  sectionId,
  title,
  children,
  tasks,
  setTasks,
}: TaskSectionProps) => {
  const [isDragging, setDragging] = useState(false);

  const onAddTask = () => {
    taskModalStore.setState({
      isOpen: true,
      data: {
        sectionId,
        id: generateId(),
        title: "",
      },
    });
  };

  return (
    <div
      className={cn(
        "w-[240px] rounded-md shrink-0 min-h-full",
        isDragging && "bg-muted/10"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);

        const srcSectionId = parseInt(e.dataTransfer.getData("sectionId"));
        const id = e.dataTransfer.getData("id");

        if (Number.isNaN(srcSectionId) || !id || srcSectionId === sectionId) {
          return;
        }

        const itemIdx = tasks[srcSectionId].items.findIndex(
          (i: any) => i.id === id
        );
        if (itemIdx < 0) {
          return;
        }

        const newTasks = produce(tasks, (state: any) => {
          const srcItem = state[srcSectionId].items.splice(itemIdx, 1)[0];
          state[sectionId].items.push(srcItem);
        });
        setTasks(newTasks);
      }}
    >
      <div className="bg-muted/50 rounded-md py-2 px-4 flex items-center justify-between">
        <p className="truncate flex-1">{title}</p>
        <IconButton icon={<Plus />} onClick={onAddTask} />
      </div>
      <div className="space-y-3 w-full mt-4">{children}</div>
    </div>
  );
};

type TaskItemProps = {
  sectionId: number;
  id: string;
  title: string;
};

const TaskItem = ({ sectionId, id, title }: TaskItemProps) => {
  return (
    <div
      className="border rounded-md p-4 hover:bg-muted/40 transition-colors cursor-pointer"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("sectionId", String(sectionId));
        e.dataTransfer.setData("id", id);
      }}
      onClick={(e) => {
        e.preventDefault();
        taskModalStore.setState({
          isOpen: true,
          data: { sectionId, id, title },
        });
      }}
    >
      <NotepadText className="text-muted-foreground" size={24} />
      <p className="mt-2 text-lg">{title}</p>
    </div>
  );
};

export default TasksPage;
