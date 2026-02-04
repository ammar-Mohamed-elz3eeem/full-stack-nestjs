import { useContext } from "react";
import { authContext } from "../context/auth.context";

export const useAuth = () => {
  const auth = useContext(authContext);

  if (!auth) {
    throw new Error("UseAuth must be used within an AuthProvider");
  }

  return auth;
};
