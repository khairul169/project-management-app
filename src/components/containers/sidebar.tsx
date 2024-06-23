import { useGetAll } from "@/hooks/usePouchDb";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import Button, { IconButton } from "../ui/button";
import { Home, Plus, SquareKanban } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDatabase } from "@/context/database";
import { initialProject } from "@/schema/project";
import { Slot } from "@radix-ui/react-slot";
import UserMenu from "./user-menu";

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
    <aside className={cn("flex flex-col items-stretch h-full p-4", className)}>
      <div className="flex flex-col items-stretch overflow-y-auto flex-1">
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
      </div>

      <UserMenu className="md:hidden" />
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
        "justify-start border-transparent items-center text-left gap-2 truncate h-12 shrink-0 bg-secondary hover:bg-primary/10",
        isActive && "bg-primary/20"
      )}
    >
      <Slot className="shrink-0 w-5">{icon}</Slot>
      <p className="truncate font-normal">{children}</p>
    </Button>
  );
};

export default Sidebar;
