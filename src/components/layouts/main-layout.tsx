import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen items-stretch">
      <Outlet />
    </div>
  );
};

export default MainLayout;
