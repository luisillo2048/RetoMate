import React, { useState, useEffect, useRef } from "react";
import {View,Text,TextInput,TouchableOpacity,ScrollView,Image,Alert,Animated,Dimensions,StyleSheet,} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../api/auth";
import styles from "../themes/RegisterStyles";
import { Picker } from "@react-native-picker/picker";

const burbujaImage = require("../../assets/images/animacionRegister.png");
const registerImage = require("../../assets/images/register1.png");

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

const RegisterScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [grado, setGrado] = useState("");
  const [codigo_maestro, setCodigoMaestro] = useState("");

  const { width, height } = Dimensions.get("window");
  const NUMERO_BURBUJAS = 30;

  const burbujasRef = useRef(
    Array.from({ length: NUMERO_BURBUJAS }, () => ({
      animation: new Animated.Value(0),
      startX: Math.random() * width,
      driftX: (Math.random() - 0.5) * 200,
      scale: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 8000,
      startY: height + 100,
      endY: -200,
      size: 30 + Math.random() * 110,
    }))
  ).current;

  useEffect(() => {
    const animationRefs: Animated.CompositeAnimation[] = [];

    burbujasRef.forEach((burbuja) => {
      const animateBurbuja = () => {
        const anim = Animated.timing(burbuja.animation, {
          toValue: 1,
          duration: 8000 + Math.random() * 7000,
          delay: burbuja.delay,
          useNativeDriver: true,
        });

        const animationInstance = anim.start(() => {
          burbuja.animation.setValue(0);
          animateBurbuja();
        });

        animationRefs.push(animationInstance);
      };
      animateBurbuja();
    });

    return () => {
      animationRefs.forEach((anim) => anim?.stop());
    };
  }, []);

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

    const usernameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwdRef = useRef<TextInput>(null);
    const passwd2Ref = useRef<TextInput>(null);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={[
        styles.container,
        theme === "light" ? styles.lightContainer : styles.darkContainer,
      ]}
    >
      {/* Fondo animado */}
      <View style={[StyleSheet.absoluteFill, styles.bubblesContainer]}>
        {burbujasRef.map((burbuja, index) => {
          const translateY = burbuja.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [burbuja.startY, burbuja.endY],
          });

          const translateX = burbuja.animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, burbuja.driftX, burbuja.driftX * 1.3],
          });

          const opacity = burbuja.animation.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.Image
              key={`bubble-${index}`}
              source={burbujaImage}
              style={{
                position: "absolute",
                opacity,
                width: burbuja.size,
                height: burbuja.size,
                left: burbuja.startX,
                transform: [
                  { translateX },
                  { translateY },
                  { scale: burbuja.scale },
                ],
              }}
            />
          );
        })}
      </View>

      {/* Caja principal */}
      <View style={styles.mainBox}>
        <Image
          source={registerImage}
          style={styles.headerImage}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <MaterialCommunityIcons name="star" size={32} color="#FFD700" />
          <Text style={styles.title}>¡Vamos a Aprender!</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="#FF6B6B"
              style={styles.icon}
            />
            <TextInput
              ref={usernameRef}
              placeholder="Tu nombre divertido"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              onSubmitEditing={() => emailRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Correo */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              color="#4ECDC4"
              style={styles.icon}
            />
            <TextInput
              ref={emailRef}
              placeholder="Correo (si tienes uno)"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              onSubmitEditing={() => passwdRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color="#FFA07A"
              style={styles.icon}
            />
            <TextInput
              ref={passwdRef}
              placeholder="Contraseña secreta"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              onSubmitEditing={() => passwd2Ref.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={24}
              color="#98D8C8"
              style={styles.icon}
            />
            <TextInput
              ref={passwd2Ref}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              onSubmitEditing={handleRegister}
              returnKeyType="next"
            />
          </View>

          {/* Selector de grado */}
  <View style={styles.pickerContainer}>
  <MaterialCommunityIcons
    name="school"
    size={24}
    color="#4ECDC4"
    style={styles.icon}
  />
  <Picker
    selectedValue={grado}
    style={styles.picker}
    dropdownIconColor="#4ECDC4"
    onValueChange={(itemValue) => setGrado(itemValue)}
  >
    <Picker.Item label="Selecciona tu grado" value="" />
    <Picker.Item label="1A°" value="1A°" />
    <Picker.Item label="1B°" value="1B°" />
    <Picker.Item label="1C°" value="1C°" />
  </Picker>
</View>


          {/* Código maestro */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="key"
              size={24}
              color="#4ECDC4"
              style={styles.icon}
            />
            <TextInput
              placeholder="Código del maestro"
              placeholderTextColor="#888"
              value={codigo_maestro}
              onChangeText={setCodigoMaestro}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Botón de registro */}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>¡Empezar a Jugar!</Text>
            <MaterialCommunityIcons
              name="gamepad-variant"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Link para login */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.switchLink}>¡Entra aquí!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
