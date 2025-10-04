import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Animated, AccessibilityInfo } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // NUEVO
import { useAuth } from "../hooks/useAuth";
import { Audio } from "expo-av";
import styles from "../themes/Styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Welcome: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

// Imágenes
const holaabuImage = require("../../assets/images/holaabu.png");
const holaabuelitoImage = require("../../assets/images/holaabuelito.png");
const bienvenidaImage = require("../../assets/images/Welcome1.png");

// Audio
const welcomeSound = require("../../assets/audios/welcome.mp3");

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // NUEVO: para safe area
  
  const anim1Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim2Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim3Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim4Ref = useRef<Animated.CompositeAnimation | null>(null);

  // Estados
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [soundPaused, setSoundPaused] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false); // NUEVO

  const soundRef = useRef<Audio.Sound | null>(null);

  const topLeftOpacity = useRef(new Animated.Value(0)).current;
  const topRightOpacity = useRef(new Animated.Value(0)).current;
  const bottomLeftOpacity = useRef(new Animated.Value(0)).current;
  const bottomRightOpacity = useRef(new Animated.Value(0)).current;

  // NUEVO: Detectar configuración del sistema
  useEffect(() => {
    // Verificar configuración inicial
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setSystemReduceMotion(enabled);
      if (enabled) {
        setAnimationsPaused(true); // Pausar automáticamente si el sistema lo indica
      }
    });

    // Escuchar cambios en tiempo real
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setSystemReduceMotion(enabled);
        if (enabled) {
          stopAllAnimations();
          setAnimationsPaused(true);
        } else {
          // Opcional: reanudar si el usuario activa animaciones en el sistema
          // startAllAnimations();
          // setAnimationsPaused(false);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const playSound = async () => {
      try {
        const s = new Audio.Sound();
        await s.loadAsync(welcomeSound);
        soundRef.current = s;
        await s.playAsync();
      } catch (error) {
        console.log("Error al reproducir audio:", error);
      }
    };

    playSound();

    const createAnimation = (
      animation: Animated.Value,
      delay: number
    ): Animated.CompositeAnimation => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    anim1Ref.current = createAnimation(topLeftOpacity, 0);
    anim2Ref.current = createAnimation(topRightOpacity, 500);
    anim3Ref.current = createAnimation(bottomLeftOpacity, 1000);
    anim4Ref.current = createAnimation(bottomRightOpacity, 1500);

    // MODIFICADO: Solo iniciar si no hay reducción de movimiento
    if (!systemReduceMotion && !animationsPaused) {
      anim1Ref.current.start();
      anim2Ref.current.start();
      anim3Ref.current.start();
      anim4Ref.current.start();
    }

    return () => {
      anim1Ref.current?.stop();
      anim2Ref.current?.stop();
      anim3Ref.current?.stop();
      anim4Ref.current?.stop();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [systemReduceMotion]); // MODIFICADO: agregar dependencia

  const startAllAnimations = () => {
    anim1Ref.current?.start();
    anim2Ref.current?.start();
    anim3Ref.current?.start();
    anim4Ref.current?.start();
  };

  const stopAllAnimations = () => {
    anim1Ref.current?.stop();
    anim2Ref.current?.stop();
    anim3Ref.current?.stop();
    anim4Ref.current?.stop();
  };

  const toggleAnimations = () => {
    if (!animationsPaused) {
      stopAllAnimations();
      setAnimationsPaused(true);
    } else {
      startAllAnimations();
      setAnimationsPaused(false);
    }
  };

  const toggleSound = async () => {
    try {
      const s = soundRef.current;
      if (!s) return;
      const status = await s.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await s.pauseAsync();
          setSoundPaused(true);
        } else {
          await s.playAsync();
          setSoundPaused(false);
        }
      }
    } catch (error) {
      console.log('Error toggling sound:', error);
    }
  };

  const handleStart = () => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}> {/* MODIFICADO: SafeAreaView */}
      {/* Botones de control con espacio seguro en la parte superior */}
      <View style={[styles.topControlsRow, { marginTop: insets.top }]}> {/* MODIFICADO */}
        {/* Botón animaciones */}
        <TouchableOpacity
          onPress={toggleAnimations}
          style={[styles.pauseButton, animationsPaused ? styles.pauseButtonSelected : null]}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            animationsPaused ? "Reanudar animaciones" : "Pausar animaciones"
          }
          accessibilityHint="Activa o desactiva las animaciones en la pantalla"
          accessibilityState={{ disabled: false, selected: animationsPaused }}
        >
          <MaterialCommunityIcons
            name="animation"
            size={20}
            color={animationsPaused ? "gray" : "black"}
            importantForAccessibility="no"
          />
          <Text style={styles.pauseButtonText}>
            {animationsPaused ? "Reanudar" : "Pausar"}
          </Text>
        </TouchableOpacity>

        {/* Botón sonido */}
        <TouchableOpacity
          onPress={toggleSound}
          style={[styles.pauseButton, soundPaused ? styles.pauseButtonSelected : null]}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={soundPaused ? "Reanudar sonido" : "Pausar sonido"}
          accessibilityHint="Activa o desactiva la reproducción de audio"
          accessibilityState={{ disabled: false, selected: soundPaused }}
        >
          <MaterialCommunityIcons
            name={soundPaused ? "volume-off" : "volume-high"}
            size={20}
            color={soundPaused ? "gray" : "black"}
            importantForAccessibility="no"
          />
          <Text style={styles.pauseButtonText}>{soundPaused ? "Reanudar" : "Silenciar"}</Text>
        </TouchableOpacity>
      </View>

      {/* Imágenes animadas en las esquinas */}
      <Animated.View
        style={[
          styles.cornerImageContainer,
          { top: 20 + insets.top, left: 20, opacity: topLeftOpacity }, {/* MODIFICADO */}
        ]}
      >
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View
        style={[
          styles.cornerImageContainer,
          { top: 20 + insets.top, right: 20, opacity: topRightOpacity }, {/* MODIFICADO */}
        ]}
      >
        <Image source={holaabuelitoImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View
        style={[
          styles.cornerImageContainer,
          { bottom: 20 + insets.bottom, left: 20, opacity: bottomLeftOpacity }, {/* MODIFICADO */}
        ]}
      >
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View
        style={[
          styles.cornerImageContainer,
          { bottom: 20 + insets.bottom, right: 20, opacity: bottomRightOpacity }, {/* MODIFICADO */}
        ]}
      >
        <Image source={holaabuelitoImage} style={styles.cornerImage} />
      </Animated.View>

      {/* Contenido principal */}
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
    </SafeAreaView>
  );
};

export default WelcomeScreen;