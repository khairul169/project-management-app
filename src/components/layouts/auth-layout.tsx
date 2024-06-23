import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
