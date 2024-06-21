import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "./components/layouts/main-layout";

const appRouter = createBrowserRouter([
  {
    Component: MainLayout,
    ErrorBoundary: lazy(() => import("./pages/errors/error-boundary")),
    children: [{ index: true, Component: lazy(() => import("./pages/home")) }],
  },
  {
    path: "*",
    Component: lazy(() => import("./pages/errors/not-found")),
  },
]);

const Router = () => {
  return <RouterProvider router={appRouter} />;
};

export default Router;
