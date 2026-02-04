import { FullScreenLoader } from "@/components/ui/loader.component";
import { SonnerToaster } from "@/components/ui/sonner.component";
import { useAuth } from "@/hooks/auth.hook";
import { AppRouter } from "@/routes";

export function RootLayout() {
  const { isLoadingCurrentUser } = useAuth();

  return (
    <>
      <SonnerToaster />
      <FullScreenLoader isLoading={isLoadingCurrentUser}>
        <AppRouter />
      </FullScreenLoader>
    </>
  );
}
