import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../hooks/useAuth";
import styles from "../themes/Styles";

const bienvenidaImage = require("../../assets/images/Welcome1.png");

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Welcome: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

export const MainContent: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.mainContent}>
      <Image source={bienvenidaImage} style={styles.mainImage} />
      <Text style={styles.title}>¡Matemáticas Divertidas!</Text>
      <Text style={styles.subtitle}>
        Aprende sumando sonrisas,{"\n"}
        restando dificultades,{"\n"}
        y multiplicando diversión
      </Text>
      <TouchableOpacity
        onPress={handleStart}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>¡Comenzar Aventura!</Text>
      </TouchableOpacity>
    </View>
  );
};