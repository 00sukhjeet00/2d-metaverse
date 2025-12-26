import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS, APP_ROUTES } from "../utils/constants";

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    navigate(APP_ROUTES.ROOMS);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
