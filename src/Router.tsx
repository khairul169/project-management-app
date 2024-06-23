import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layouts/main-layout";
import AuthLayout from "./components/layouts/auth-layout";

const appRouter = createBrowserRouter([
  {
    Component: MainLayout,
    ErrorBoundary: lazy(() => import("./pages/errors/error-boundary")),
    children: [
      { index: true, Component: lazy(() => import("./pages/home")) },
      {
        path: "project/:id",
        Component: lazy(() => import("./pages/project")),
        children: [
          {
            index: true,
            Component: lazy(() => import("./pages/project/content")),
          },
          {
            path: "tasks",
            Component: lazy(() => import("./pages/project/tasks")),
          },
        ],
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: lazy(() => import("./pages/auth/login")),
      },
    ],
  },
  {
    path: "*",
    Component: lazy(() => import("./pages/errors/not-found")),
  },
]);

const Router = () => {
  return (
    <Suspense>
      <RouterProvider router={appRouter} />
    </Suspense>
  );
};

export default Router;
