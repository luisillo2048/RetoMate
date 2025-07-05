import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import { registerUser } from "../api/auth";
import styles from "../themes/RegisterStyles";

const RegisterScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerUser(username, email, password);
      Alert.alert("Éxito", "Registro exitoso. Ahora puedes iniciar sesión.");
      router.push("/auth/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "No se pudo registrar. Inténtalo de nuevo.";
      Alert.alert("Error", msg);
      console.error("Error en el registro:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={[
        styles.container,
        theme === "light" ? styles.lightContainer : styles.darkContainer,
      ]}
    >
      <View style={styles.whiteBox}>
        <Image
          source={require("../../assets/images/register.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={32}
            color="#BB86FC"
          />
          <Text style={styles.title}>¡Únete a la diversión!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color="#BB86FC"
              style={styles.icon}
            />
            <TextInput
              placeholder="Nombre de usuario"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              color="#BB86FC"
              style={styles.icon}
            />
            <TextInput
              placeholder="Correo"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color="#BB86FC"
              style={styles.icon}
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={24}
              color="#BB86FC"
              style={styles.icon}
            />
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Registro</Text>
            <MaterialCommunityIcons
              name="star-four-points"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.switchLink}>¡Inicia sesión!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;