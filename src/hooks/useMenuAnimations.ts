import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const useMenuAnimations = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const drawerSlideAnim = useRef(new Animated.Value(-300)).current;
  const chatBotTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Animación de pulso continua para el chatbot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Configurar el listener para el scroll
    const scrollListener = scrollY.addListener(({ value }) => {
      chatBotTranslateY.setValue(-value * 0.3);
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, []);

  const openDrawerAnimation = () => {
    Animated.timing(drawerSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawerAnimation = () => {
    Animated.timing(drawerSlideAnim, {
      toValue: -300,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return {
    bounceAnim,
    pulseAnim,
    slideAnim,
    fadeAnim,
    drawerSlideAnim,
    chatBotTranslateY,
    scrollY,
    openDrawerAnimation,
    closeDrawerAnimation,
    handleScroll
  };
};