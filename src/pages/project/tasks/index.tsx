import { useProject } from "../components/context";
import { useDatabase } from "@/context/database";
import TaskModal from "./task-modal";
import TaskSection from "./task-section";
import { taskModalStore } from "./stores";
import { curTimestamp, generateId } from "@/lib/utils";

const TasksPage = () => {
  const { data } = useProject();
  const db = useDatabase();

  const onAddTask = (sectionId: string) => {
    taskModalStore.setState({
      isOpen: true,
      data: {
        _id: generateId(),
        projectId: data._id,
        sectionId,
        title: "",
        description: "",
        createdAt: curTimestamp(),
        updatedAt: curTimestamp(),
        index: -1,
      },
    });
  };

  const onTaskMove = async (
    _sectionId: string,
    id: string,
    toSectionId: string,
    toIndex: number = 0
  ) => {
    try {
      const tasks = await db.tasks
        .find({
          selector: { index: { $gt: null }, sectionId: toSectionId },
          sort: ["index"],
        })
        .then((i) => i.docs.filter((i) => i._id !== id));

      const task = await db.tasks.get(id);
      tasks.splice(toIndex, 0, { ...task, sectionId: toSectionId });

      const update = tasks.map((t, index) => ({ ...t, index }));
      await db.tasks.bulkDocs(update);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex-1 flex overflow-auto gap-x-4 px-4 md:px-8">
        {data.taskSections?.map((task) => (
          <TaskSection
            key={task.id}
            data={task}
            onAddTask={() => onAddTask(task.id)}
            onTaskMove={onTaskMove}
          />
        ))}
      </div>

      <TaskModal />
    </>
  );
};

export default TasksPage;
