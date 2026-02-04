import { useState, type PropsWithChildren } from "react";
import {
  authContext,
  type AuthUser,
  type AuthObject,
} from "../context/auth.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/client";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signInMutation = useMutation<
    AuthObject,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      return await apiClient
        .post<AuthObject>("auth/login", { email, password })
        .then((response) => {
          return response;
        });
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signUpMutation = useMutation<
    AuthObject,
    Error,
    { email: string; password: string; fullName: string }
  >({
    mutationFn: async ({ fullName, email, password }) => {
      return await apiClient
        .post<AuthObject>("auth/register", { fullName, email, password })
        .then((response) => {
          return response;
        });
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  const currentUserQuery = useQuery<AuthUser | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient
        .get<AuthUser>("auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })
        .then((response) => response);
      setIsAuthenticated(true);
      setUser(response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthObject> => {
    console.log("Perform signinMutation with:", { email, password });
    return await signInMutation.mutateAsync({ email, password });
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthObject> => {
    return await signUpMutation.mutateAsync({
      fullName: name,
      email,
      password,
    });
  };

  return (
    <authContext.Provider
      value={{
        user,
        setCurrentUser: setUser,
        isAuthenticated,
        setIsAuthenticated,
        signIn,
        signUp,
        signOut: logout,
        isLoadingCurrentUser: currentUserQuery.isLoading,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
