import { Databases } from "@/context/database";
import { projectSchema } from "@/schema/project";
import { taskSchema } from "@/schema/task";

export const databaseSchema = {
  projects: projectSchema,
  tasks: taskSchema,
};

export const onDatabaseInit = async (db: Databases) => {
  await db.tasks.createIndex({
    index: { fields: ["index", "sectionId", "projectId"] },
  });
};
