import { useProject } from "../components/context";
import { ProjectTasks } from "@/schema/project";
import { produce } from "immer";
import { useDatabase } from "@/context/database";
import TaskModal from "./task-modal";
import TaskSection from "./task-section";
import TaskItem from "./task-item";
import { taskModalStore } from "./stores";
import { curTimestamp } from "@/lib/utils";

const TasksPage = () => {
  const { data } = useProject();
  const db = useDatabase();
  const { tasks } = data;

  const setTasks = async (tasks: ProjectTasks) => {
    try {
      await db.projects.put({ ...data, tasks });
    } catch (err) {
      console.error(err);
    }
  };

  const onAddTask = (sectionId: string) => {
    taskModalStore.setState({
      isOpen: true,
      data: {
        sectionId,
        id: "",
        title: "",
        description: "",
        createdAt: curTimestamp(),
        updatedAt: curTimestamp(),
      },
    });
  };

  const onTaskMove = (
    sectionId: string,
    id: string,
    toSectionId: string,
    toIndex: number = 0
  ) => {
    const res = produce(tasks, (tasks) => {
      const src = tasks.find((i) => i.id === sectionId);
      const idx = src?.items?.findIndex((i) => i.id === id);
      const target =
        sectionId === toSectionId
          ? src
          : tasks.find((i) => i.id === toSectionId);

      if (!src || idx == null || idx < 0 || !target) {
        return;
      }

      const task = src.items.splice(idx, 1)[0];
      target.items.splice(toIndex, 0, task);
    });

    setTasks(res);
  };

  return (
    <>
      <div className="flex-1 flex overflow-auto gap-x-4 px-4 md:px-8">
        {tasks?.map((task) => (
          <TaskSection
            key={task.section}
            data={task}
            onAddTask={() => onAddTask(task.id)}
            onTaskMove={onTaskMove}
          >
            {task.items?.map((item) => (
              <TaskItem key={item.id} sectionId={task.id} data={item} />
            ))}
          </TaskSection>
        ))}
      </div>

      <TaskModal />
    </>
  );
};

export default TasksPage;
