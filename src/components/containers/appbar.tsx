import React from "react";
import { IconButton } from "../ui/button";
import UserMenu from "./user-menu";
import { cn } from "@/lib/utils";

type Appbar = {
  title?: string | React.ReactElement;
  actions?: React.ReactNode;
};

const Appbar = ({ title, actions }: Appbar) => {
  return (
    <header className="bg-background border-b md:border-b-0 text-foreground">
      <div className="hidden md:flex items-center justify-end h-16 px-4">
        <UserMenu className="hidden md:flex" />
      </div>

      <div className="flex items-center gap-4 px-4 h-16">
        {title && typeof title === "string" ? (
          <AppbarTitle className="flex-1">{title}</AppbarTitle>
        ) : (
          <div className="flex-1 truncate">{title}</div>
        )}

        {actions}
      </div>
    </header>
  );
};

const AppbarAction = IconButton;
AppbarAction.displayName = "AppbarAction";
Appbar.Action = AppbarAction;

const AppbarTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1 className={cn("text-lg md:text-2xl truncate md:ml-4", className)}>
    {children}
  </h1>
);
Appbar.Title = AppbarTitle;

export default Appbar;
