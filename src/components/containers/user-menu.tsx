import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { User } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";

type UserMenuProps = {
  className?: string;
};

const UserMenu = ({ className }: UserMenuProps) => {
  const auth = useAuth();
  const logout = useLogout();

  return (
    <Button
      href="/auth/login"
      variant="secondary"
      className={cn("gap-2", className)}
      size="sm"
      onClick={(e) => {
        if (auth.token) {
          e.preventDefault();
          logout();
        }
      }}
    >
      <User size={18} />
      <p>{auth.token ? auth.token : "Login"}</p>
    </Button>
  );
};

export default UserMenu;
