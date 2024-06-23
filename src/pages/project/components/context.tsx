/* eslint-disable react-refresh/only-export-components */
import { UseGetOneReturn } from "@/hooks/usePouchDb";
import { Project } from "@/schema/project";
import { createContext, useContext } from "react";

export const ProjectContext = createContext<UseGetOneReturn<Project>>(null!);

export const useProject = () => {
  const data = useContext(ProjectContext);
  if (!data) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return { ...data, data: data.data! };
};
