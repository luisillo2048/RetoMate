import React, { useState, useEffect, useRef } from "react";
import {View,Text,TextInput,TouchableOpacity,ScrollView,Image,Alert,Animated,Dimensions,StyleSheet, AccessibilityInfo,} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../api/auth";
import styles from "../themes/RegisterStyles";
import commonStyles from "../themes/Styles";
import { Picker } from "@react-native-picker/picker";

// Imágenes
const burbujaImage = require("../../assets/images/animacionRegister.png");
const registerImage = require("../../assets/images/register1.png");

// Tipos de navegación
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
  const insets = useSafeAreaInsets();
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
  // control de pausa para las burbujas
  const animationsActiveRef = useRef(true);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [soundPaused, setSoundPaused] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const welcomeSound = require("../../assets/audios/welcome.mp3");

  const startAllBurbujas = () => {
    animationsActiveRef.current = true;
    burbujasRef.forEach((burbuja) => {
      const animateBurbuja = () => {
        if (!animationsActiveRef.current) return;
        Animated.timing(burbuja.animation, {
          toValue: 1,
          duration: 8000 + Math.random() * 7000,
          delay: burbuja.delay,
          useNativeDriver: true,
        }).start(() => {
          if (!animationsActiveRef.current) return;
          burbuja.animation.setValue(0);
          animateBurbuja();
        });
      };
      animateBurbuja();
    });
  };

  const stopAllBurbujas = () => {
    animationsActiveRef.current = false;
    burbujasRef.forEach((burbuja) => {
      try {
        burbuja.animation.stopAnimation();
      } catch (e) {}
    });
  };

  useEffect(() => {
    // Detectar preferencia del sistema para reducir animaciones
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setSystemReduceMotion(enabled);
      if (enabled) {
        stopAllBurbujas();
        setAnimationsPaused(true);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setSystemReduceMotion(enabled);
        if (enabled) {
          stopAllBurbujas();
          setAnimationsPaused(true);
        }
      }
    );

    // iniciar animaciones y audio si no hay preferencia de reducir movimiento
    const setup = async () => {
      if (!systemReduceMotion && !animationsPaused) {
        startAllBurbujas();
      }

        try {
          const s = new Audio.Sound();
          // loadAsync usando require
          await s.loadAsync(welcomeSound);
          soundRef.current = s;
          await s.playAsync();
          setSoundPaused(false);
        } catch (error) {
        console.log('Error al cargar audio en RegisterScreen:', error);
      }
    };

    setup();

    return () => {
      subscription.remove();
      stopAllBurbujas();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const toggleAnimations = () => {
    if (!animationsPaused) {
      stopAllBurbujas();
      setAnimationsPaused(true);
    } else {
      startAllBurbujas();
      setAnimationsPaused(false);
    }
  };

  const toggleSound = () => {
    try {
      const s = soundRef.current;
      if (!s) {
        setSoundPaused((v) => !v);
        return;
      }
      s.getStatusAsync().then((status: any) => {
        if (status.isLoaded) {
          if (status.isPlaying) {
            s.pauseAsync();
            setSoundPaused(true);
          } else {
            s.playAsync();
            setSoundPaused(false);
          }
        }
      }).catch((err: any) => console.log('Error status audio toggle:', err));
    } catch (e) {
      setSoundPaused((v) => !v);
    }
  };

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
    <SafeAreaView style={[styles.container, { flex: 1 }]}> 
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={[
        styles.container,
        theme === "light" ? styles.lightContainer : styles.darkContainer,
      ]}
    >
      {/* controles superiores: pausar animaciones / sonido */}
  <View style={[commonStyles.topControlsRow, { marginTop: insets.top }]} pointerEvents="box-none">
        <TouchableOpacity
          onPress={toggleAnimations}
          style={[commonStyles.pauseButton, animationsPaused ? commonStyles.pauseButtonSelected : null]}
        >
          <MaterialCommunityIcons name="animation" size={20} color={animationsPaused ? 'gray' : 'black'} />
          <Text style={commonStyles.pauseButtonText}>{animationsPaused ? 'Reanudar' : 'Pausar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleSound}
          style={[commonStyles.pauseButton, soundPaused ? commonStyles.pauseButtonSelected : null]}
        >
          <MaterialCommunityIcons name={soundPaused ? 'volume-off' : 'volume-high'} size={20} color={soundPaused ? 'gray' : 'black'} />
          <Text style={commonStyles.pauseButtonText}>{soundPaused ? 'Reanudar' : 'Silenciar'}</Text>
        </TouchableOpacity>
      </View>
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
          style={styles.headerImage as any}
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
    </SafeAreaView>
  );
};

export default RegisterScreen;
