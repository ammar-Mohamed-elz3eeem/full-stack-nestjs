import { Button } from "@/components/ui/button.component";
import { useAuth } from "@/hooks/auth.hook";
import { Navigate } from "react-router-dom";

export default function DashboardPage() {
  const { signOut, user, isAuthenticated } = useAuth();

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Button onClick={() => signOut()}>Logout</Button>
      <Button disabled>{user?.email}</Button>
      <Button onClick={() => {}}>Get All Users</Button>
    </div>
  );
}
