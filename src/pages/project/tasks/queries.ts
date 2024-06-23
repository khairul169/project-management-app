import { useDatabase } from "@/context/database";
import { useFindAll } from "@/hooks/usePouchDb";
import { useMemo } from "react";

export const useTaskListQuery = (sectionId: string) => {
  const db = useDatabase();

  const findTasksOptions = useMemo(() => {
    return {
      selector: { index: { $gt: null }, sectionId },
      sort: ["index"],
    };
  }, [sectionId]);

  const { data: tasks } = useFindAll(db.tasks, findTasksOptions);

  return tasks;
};
