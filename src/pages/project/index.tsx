import Appbar from "@/components/containers/appbar";
import { useGetOne } from "@/hooks/usePouchDb";
import { Outlet, useParams } from "react-router-dom";
import Title from "./components/title";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/context/database";
import { ProjectContext } from "./components/context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewProjectPage = () => {
  const params = useParams();
  const db = useDatabase();
  const projectId = params.id as string;
  const project = useGetOne(db.projects, projectId);

  return (
    <>
      <Appbar
        title={
          project.data && !project.isLoading ? (
            <Title data={project.data} />
          ) : (
            "Project"
          )
        }
      />

      {project.isLoading ? (
        <div className="p-4 md:p-8 flex-1 overflow-y-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-20" />
          ))}
        </div>
      ) : project.error || !project.data ? (
        <div className="p-4 md:p-8 flex-1 max-h-[400px] flex items-center justify-center">
          <p>
            {project.error?.message === "missing"
              ? "Project not found."
              : project.error?.message || "An error occurred."}
          </p>
        </div>
      ) : (
        <ProjectContext.Provider value={project}>
          <div className="p-4 md:p-8 md:pt-0 flex-1 flex flex-col overflow-hidden">
            <Tabs className="pb-4" routerPath={`/project/${projectId}`}>
              <TabsList>
                <TabsTrigger value="">Description</TabsTrigger>
                <TabsTrigger value="/tasks">Tasks</TabsTrigger>
              </TabsList>
            </Tabs>

            <Outlet />
          </div>
        </ProjectContext.Provider>
      )}
    </>
  );
};

export default ViewProjectPage;
