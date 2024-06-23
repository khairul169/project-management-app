import { useGetAll } from "@/hooks/usePouchDb";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import Button, { IconButton } from "../ui/button";
import { Home, Plus, SquareKanban } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDatabase } from "@/context/database";
import { initialProject } from "@/schema/project";
import { Slot } from "@radix-ui/react-slot";

const Sidebar = ({ className }: ComponentProps<"aside">) => {
  const db = useDatabase();
  const [getAllOptions] = useState({ descending: true });
  const { data: projects } = useGetAll(db.projects, getAllOptions);
  const navigate = useNavigate();

  const onCreate = async () => {
    try {
      const result = await db.projects.put(initialProject());
      navigate(`/project/${result.id}`);
    } catch (err) {}
  };

  return (
    <aside
      className={cn(
        "bg-background border-r p-4 flex flex-col items-stretch",
        className
      )}
    >
      <NavItem icon={<Home />} path="/" isExact>
        Home
      </NavItem>

      <div className="mt-4 flex items-center justify-between">
        <p className="ml-4 font-bold text-sm">Projects</p>
        <IconButton icon={<Plus />} onClick={onCreate} />
      </div>

      <div className="space-y-2 flex flex-col items-stretch mt-1">
        {projects?.rows?.map((row) => (
          <NavItem
            icon={<SquareKanban />}
            path={`/project/${row.id}`}
            key={row.id}
          >
            {row.doc?.title}
          </NavItem>
        ))}
      </div>
    </aside>
  );
};

type NavItemProps = {
  icon?: React.ReactNode;
  path: string;
  isExact?: boolean;
  children?: React.ReactNode;
};
const NavItem = ({ icon, path, isExact, children }: NavItemProps) => {
  const { pathname } = useLocation();
  const isActive = isExact ? pathname === path : pathname.startsWith(path);
  return (
    <Button
      variant="outline"
      href={path}
      className={cn(
        "justify-start items-center text-left gap-2 truncate h-12",
        !isActive && "border-transparent"
      )}
    >
      <Slot className="shrink-0 w-5">{icon}</Slot>
      <p className="truncate">{children}</p>
    </Button>
  );
};

export default Sidebar;
