import { useState, useRef } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export const useLoginForm = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = useRef<any>(null);
  const passwdRef = useRef<any>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales.");
      return;
    }

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await login(data.token);
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        (navigation as any).reset({
          index: 0,
          routes: [{ name: "Home" }], 
        });
      } else {
        const errorMsg = data?.msg || data?.message || "Credenciales incorrectas";
        Alert.alert("Error", errorMsg);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error de conexión";
      Alert.alert("Error", msg);
    }
  };

  const navigateToRegister = () => {
    (navigation as any).navigate("Register");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    usernameRef,
    passwdRef,
    handleLogin,
    navigateToRegister
  };
};