import React from "react";
import { IconButton } from "../ui/button";
import UserMenu from "./user-menu";
import { cn } from "@/lib/utils";
import MobileSidebar from "./mobile-sidebar";

type Appbar = {
  title?: string | React.ReactElement;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
};

const Appbar = ({ title, actions, leading }: Appbar) => {
  return (
    <header className="bg-background border-b md:border-b-0 text-foreground">
      <div className="flex items-center gap-3 md:py-4 px-4 flex-wrap">
        {leading || <MobileSidebar />}

        <div className="flex-1 hidden md:block" />

        <div className="flex items-center h-16 md:pl-4 md:h-auto md:order-last md:basis-full">
          {title && typeof title === "string" ? (
            <AppbarTitle className="flex-1">{title}</AppbarTitle>
          ) : (
            <div className="flex-1 truncate">{title}</div>
          )}
        </div>

        {actions}
        <UserMenu className="hidden md:flex" />
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
  <h1 className={cn("text-lg md:text-2xl truncate", className)}>{children}</h1>
);
Appbar.Title = AppbarTitle;

export default Appbar;
