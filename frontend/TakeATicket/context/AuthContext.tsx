import { storage } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: string | null;
  userRole: string | null;
  setAuth: (id: string | null, role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedUserId = await storage.getItem("userId");
      const storedUserRole = await storage.getItem("role");

      setUserId(storedUserId);
      setUserRole(storedUserRole);
    };

    loadAuthData();
  }, []);

  const setAuth = (id: string | null, role: string | null) => {
    setUserId(id);
    setUserRole(role);
  };

  return (
    <AuthContext.Provider value={{ userId, userRole, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
