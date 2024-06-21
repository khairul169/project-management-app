import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const Sidebar = ({ className }: ComponentProps<"aside">) => {
  return (
    <aside className={cn("bg-background border-r border-secondary", className)}>
      test
    </aside>
  );
};

export default Sidebar;
