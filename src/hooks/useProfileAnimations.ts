import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const useProfileAnimations = () => {
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const logoSpinAnim = useRef(new Animated.Value(0)).current;
  const balloonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Animación de globos flotando
      Animated.loop(
        Animated.sequence([
          Animated.timing(balloonAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(balloonAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de rebote mejorada
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();

      // Animación de deslizamiento suave
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();

      // Animación de fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Animación de rotación continua para elementos divertidos
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Animación especial del logo - gira por unos segundos y se centra
      Animated.sequence([
        Animated.timing(logoSpinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoSpinAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ]).start();
    };

    startAnimations();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const logoSpinInterpolate = logoSpinAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: ['0deg', '720deg', '720deg']
  });

  const balloonTranslateY = balloonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  return {
    bounceAnim,
    slideAnim,
    fadeAnim,
    rotateAnim,
    logoSpinAnim,
    balloonAnim,
    rotateInterpolate,
    logoSpinInterpolate,
    balloonTranslateY
  };
};