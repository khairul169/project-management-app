import { useGetAll } from "@/hooks/usePouchDb";
import { cn, curTimestamp, generateId } from "@/lib/utils";
import { Project } from "@/schema/project";
import { ComponentProps, useState } from "react";
import Button from "../ui/button";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ className }: ComponentProps<"aside">) => {
  const [getAllOptions] = useState({ descending: true });
  const { data } = useGetAll<Project>(db, getAllOptions);
  const navigate = useNavigate();

  const onCreate = async () => {
    try {
      const result = await db.put<Project>({
        _id: generateId(),
        title: "Untitled Project",
        content: "",
        createdAt: curTimestamp(),
        updatedAt: curTimestamp(),
      });
      navigate(`/project/${result.id}`);
    } catch (err) {}
  };

  return (
    <aside className={cn("bg-background border-r p-4", className)}>
      <Button onClick={onCreate} className="w-full gap-2">
        <Plus size={18} />
        Create Project
      </Button>

      <p className="mt-4">Projects</p>
      {data?.rows?.map((row) => (
        <Button
          variant="outline"
          href={`/project/${row.id}`}
          key={row.id}
          className="w-full justify-start text-left mt-2"
        >
          {row.doc?.title}
        </Button>
      ))}
    </aside>
  );
};

export default Sidebar;
