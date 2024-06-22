import Appbar from "@/components/containers/appbar";
import { useGetOne } from "@/hooks/usePouchDb";
import { db } from "@/lib/db";
import { Project } from "@/schema/project";
import { useParams } from "react-router-dom";
import Title from "./components/title";
import { Skeleton } from "@/components/ui/skeleton";
import ContentEditor from "./components/content-editor";

const ViewProjectPage = () => {
  const params = useParams();
  const projectId = params.id as string;
  const project = useGetOne<Project>(db, projectId);

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
        <ContentEditor data={project.data} />
      )}
    </>
  );
};

export default ViewProjectPage;
