import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { User } from "lucide-react";

type UserMenuProps = {
  className?: string;
};

const UserMenu = ({ className }: UserMenuProps) => {
  return (
    <Button variant="secondary" className={cn("gap-2", className)} size="sm">
      <User size={18} />
      <p>Login</p>
    </Button>
  );
};

export default UserMenu;
