import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert,Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth"; 
import styles from "../themes/LoginStyles";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth(); // <- importante: esto guarda el usuario en el contexto

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales.");
      return;
    }

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await login(data.token); // <-- Aquí se carga el usuario en el contexto
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        navigation.reset({
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


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
                  source={require("../../assets/images/logo2.png")}
                  style={styles.image}
                  resizeMode="contain"
                />

        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>
          ¿No tienes cuenta?
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.switchButton}> Regístrate</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;