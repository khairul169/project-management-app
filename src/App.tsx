import Router from "./Router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DatabaseProvider } from "./context/database";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>
        <Router />
      </DatabaseProvider>
    </QueryClientProvider>
  );
};

export default App;
