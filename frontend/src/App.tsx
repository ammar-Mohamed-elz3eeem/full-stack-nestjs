import { AuthProvider } from "./providers/Auth.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootLayout } from "./layouts/root.layout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayout></RootLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}
