import { useState, useRef } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../api/auth";

export const useRegisterForm = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [grado, setGrado] = useState("");
  const [codigo_maestro, setCodigoMaestro] = useState("");

  const usernameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwdRef = useRef<any>(null);
  const passwd2Ref = useRef<any>(null);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword || !grado) {
      Alert.alert("Oops!", "¡Falta llenar algunos campos!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Oops!", "¡Las contraseñas no son iguales!");
      return;
    }

    try {
      await registerUser(username, email, password, grado, codigo_maestro);
      Alert.alert("¡Bien hecho!", "¡Registro completado! Ahora puedes jugar");
      navigation.navigate("Login");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Algo salió mal. ¡Inténtalo de nuevo!";
      Alert.alert("Oops!", msg);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    grado,
    setGrado,
    codigo_maestro,
    setCodigoMaestro,
    usernameRef,
    emailRef,
    passwdRef,
    passwd2Ref,
    handleRegister,
    navigateToLogin
  };
};