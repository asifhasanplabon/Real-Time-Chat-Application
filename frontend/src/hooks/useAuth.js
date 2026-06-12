import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { loginUser, registerUser, logoutUser } from "../services/auth.service.js";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  const { user, setUser, loading } = context;

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return { user, setUser, loading, login, register, logout };
};

export default useAuth;