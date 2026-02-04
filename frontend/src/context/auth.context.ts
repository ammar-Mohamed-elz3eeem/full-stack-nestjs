import { createContext, type Dispatch, type SetStateAction } from "react";

export interface AuthUser {
  fullName: string;
  email: string;
  id: string;
  role: string;
}

export type AuthObject = {
  user: AuthUser;
  token: string;
  message: string;
};

export interface AuthContext {
  isLoadingCurrentUser: boolean;
  user: AuthUser | null;
  setCurrentUser: Dispatch<SetStateAction<AuthUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  signIn: (email: string, password: string) => Promise<AuthObject>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthObject>;
  signOut: () => void;
}

export const authContext = createContext<AuthContext | undefined>(undefined);
