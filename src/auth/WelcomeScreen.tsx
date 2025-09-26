import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../hooks/useAuth";
import { Audio } from "expo-av";
import styles from "../themes/Styles";

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

  const anim1Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim2Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim3Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim4Ref = useRef<Animated.CompositeAnimation | null>(null);

  const topLeftOpacity = useRef(new Animated.Value(0)).current;
  const topRightOpacity = useRef(new Animated.Value(0)).current;
  const bottomLeftOpacity = useRef(new Animated.Value(0)).current;
  const bottomRightOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let sound: Audio.Sound;

    const playSound = async () => {
      try {
        sound = new Audio.Sound();
        await sound.loadAsync(welcomeSound);
        await sound.playAsync();
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

    anim1Ref.current.start();
    anim2Ref.current.start();
    anim3Ref.current.start();
    anim4Ref.current.start();

    return () => {
      anim1Ref.current?.stop();
      anim2Ref.current?.stop();
      anim3Ref.current?.stop();
      anim4Ref.current?.stop();
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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
    <View style={styles.container}>
      {/* Imagen superior izquierda */}
      <Animated.View
        style={[
          styles.cornerImageContainer,
          { top: 20, left: 20, opacity: topLeftOpacity },
        ]}
      >
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      {/* Imagen superior derecha */}
      <Animated.View
        style={[
          styles.cornerImageContainer,
          { top: 20, right: 20, opacity: topRightOpacity },
        ]}
      >
        <Image source={holaabuelitoImage} style={styles.cornerImage} />
      </Animated.View>

      {/* Imagen inferior izquierda */}
      <Animated.View
        style={[
          styles.cornerImageContainer,
          { bottom: 20, left: 20, opacity: bottomLeftOpacity },
        ]}
      >
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      {/* Imagen inferior derecha */}
      <Animated.View
        style={[
          styles.cornerImageContainer,
          { bottom: 20, right: 20, opacity: bottomRightOpacity },
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
    </View>
  );
};

export default WelcomeScreen;
