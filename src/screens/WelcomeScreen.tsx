// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth"; // ajusta la ruta si es necesario

import styles from "../themes/Styles";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigation.replace("Home"); // Ya está logueado, lo mandamos directo al menú principal
    } else {
      navigation.navigate("Login"); // No hay sesión activa, lo mandamos al login
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={"happy-outline"} size={80} color="white" />
      </View>

      <Text style={styles.title}>¡Matemáticas Divertidas!</Text>
      <Text style={styles.subtitle}>Aprende matemáticas jugando y divirtiéndote</Text>

      <TouchableOpacity onPress={handleStart} style={styles.button}>
        <Text style={styles.buttonText}>¡Comenzar!</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image source={{ uri: "" }} style={styles.image} />
        <Image source={{ uri: "" }} style={styles.image} />
      </View>
    </View>
  );
};

export default WelcomeScreen;
