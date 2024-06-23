import Appbar from "@/components/containers/appbar";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDatabase } from "@/context/database";
import { useGetAll } from "@/hooks/usePouchDb";
import { dayjs } from "@/lib/utils";
import { initialProject } from "@/schema/project";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const db = useDatabase();
  const { data } = useGetAll(db.projects);
  const navigate = useNavigate();

  const onCreate = async () => {
    try {
      const result = await db.projects.put(initialProject());
      navigate(`/project/${result.id}`);
    } catch (err) {}
  };

  return (
    <>
      <Appbar title="Home" />

      <div className="p-4 md:p-8">
        {!data?.total_rows ? (
          <div className="flex flex-col py-32 gap-4 items-center text-center">
            <p>You have no project.</p>
            <Button onClick={onCreate}>Create New Project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {data?.rows.map((row) => (
              <Link to={`/project/${row.id}`} key={row.id}>
                <Card
                  key={row.id}
                  className="px-5 py-4 hover:bg-secondary/50 transition-colors"
                >
                  <p className="text-base">{row.doc?.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {`Last update: ${dayjs(row.doc?.updatedAt).fromNow()}`}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
