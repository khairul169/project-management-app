import { Outlet } from "react-router-dom";
import Sidebar from "../containers/sidebar";
import { Suspense } from "react";

const MainLayout = () => {
  return (
    <div className="flex h-screen items-stretch overflow-hidden">
      <div className="p-4 hidden md:flex">
        <Sidebar className="w-[250px] lg:w-[280px] bg-secondary rounded-md" />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default MainLayout;
