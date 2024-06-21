import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  const title = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : null;

  return (
    <div className="p-4 md:p-8 space-y-4">
      <h1 className="text-4xl">An error occurred</h1>
      <p className="text-2xl font-medium">{title}</p>
      {stack && <pre className="text-sm">{stack}</pre>}
    </div>
  );
};

export default ErrorBoundary;
