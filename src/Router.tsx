import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layouts/main-layout";

const appRouter = createBrowserRouter([
  {
    Component: MainLayout,
    ErrorBoundary: lazy(() => import("./pages/errors/error-boundary")),
    children: [
      { index: true, Component: lazy(() => import("./pages/home")) },
      {
        path: "/project/:id",
        Component: lazy(() => import("./pages/project/view")),
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
