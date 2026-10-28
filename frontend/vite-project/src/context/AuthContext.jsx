import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  async function login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    const { token, user: userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  }

  async function register(name, email, password) {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    const { token, user: userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}