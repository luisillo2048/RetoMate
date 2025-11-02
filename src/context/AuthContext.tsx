// AuthContext.js CORREGIDO Y FINAL

import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants"; 

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface User {
  id: string;
  username: string;
  email: string;
  grado?: string;
  codigo_maestro?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await axios.get(`${API_URL}/auth/me`);

      const userData = response.data;
      setUser({
        id: userData._id,
        username: userData.username,
        email: userData.email,
        grado: userData.grado,
        codigo_maestro: userData.codigo_maestro
      });
    } catch (error: any) {
      console.error("Error al cargar usuario:", error?.response?.data || error);
      setUser(null);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    await loadUser();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};