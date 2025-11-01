import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Animated, AccessibilityInfo, Dimensions, Alert } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppSettingsContextType {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  soundPaused: boolean;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  playAudio: (soundFile: any) => Promise<void>;
  stopAudio: () => Promise<void>;
  animationsPaused: boolean;
  toggleAnimations: () => void;
  systemReduceMotion: boolean;
  loginBurbujas: Bubble[];
  startLoginBurbujas: () => void;
  stopLoginBurbujas: () => void;
  registerBurbujas: Bubble[];
  startRegisterBurbujas: () => void;
  stopRegisterBurbujas: () => void;
  topLeftOpacity: Animated.Value;
  topRightOpacity: Animated.Value;
  bottomLeftOpacity: Animated.Value;
  bottomRightOpacity: Animated.Value;
  startWelcomeAnimations: () => void;
  stopWelcomeAnimations: () => void;
}

interface Bubble {
  animation: Animated.Value;
  startX: number;
  driftX: number;
  scale: number;
  delay: number;
  startY: number;
  endY: number;
  size: number;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundPaused, setSoundPaused] = useState(false);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showReduceMotionAlert, setShowReduceMotionAlert] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  const topLeftOpacity = useRef(new Animated.Value(0)).current;
  const topRightOpacity = useRef(new Animated.Value(0)).current;
  const bottomLeftOpacity = useRef(new Animated.Value(0)).current;
  const bottomRightOpacity = useRef(new Animated.Value(0)).current;

  const anim1Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim2Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim3Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim4Ref = useRef<Animated.CompositeAnimation | null>(null);

  const loginAnimationsActiveRef = useRef(true);
  const registerAnimationsActiveRef = useRef(true);
  
  const { width, height } = Dimensions.get('window');

  const [loginBurbujas] = useState<Bubble[]>(() => {
    const NUMERO_BURBUJAS = 40;
    const burbujas = [];
    
    for (let i = 0; i < NUMERO_BURBUJAS; i++) {
      burbujas.push({
        animation: new Animated.Value(0),
        startX: Math.random() * width,
        driftX: (Math.random() - 0.5) * 200,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 8000,
        startY: height + 100,
        endY: -200,
        size: 30 + Math.random() * 70
      });
    }
    
    return burbujas;
  });

  const [registerBurbujas] = useState<Bubble[]>(() => {
    const NUMERO_BURBUJAS = 30;
    const burbujas = [];
    
    for (let i = 0; i < NUMERO_BURBUJAS; i++) {
      burbujas.push({
        animation: new Animated.Value(0),
        startX: Math.random() * width,
        driftX: (Math.random() - 0.5) * 200,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 8000,
        startY: height + 100,
        endY: -200,
        size: 30 + Math.random() * 110,
      });
    }
    
    return burbujas;
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSound = await AsyncStorage.getItem('soundPaused');
        const savedAnimations = await AsyncStorage.getItem('animationsPaused');
        
        if (savedSound !== null) {
          setSoundPaused(JSON.parse(savedSound));
        }
        
        if (savedAnimations !== null) {
          setAnimationsPaused(JSON.parse(savedAnimations));
        }
        
        setSettingsLoaded(true);
      } catch (error) {
        console.log('Error cargando configuración:', error);
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    const checkReduceMotion = async () => {
      const enabled = await AccessibilityInfo.isReduceMotionEnabled();
      setSystemReduceMotion(enabled);
      
      if (enabled) {
        setAnimationsPaused(true);
        stopLoginBurbujas();
        stopRegisterBurbujas();
        stopWelcomeAnimations();
        
        // Mostrar alerta solo una vez
        if (!showReduceMotionAlert) {
          setShowReduceMotionAlert(true);
          setTimeout(() => {
            Alert.alert(
              "Animaciones Desactivadas",
              "Tienes activada la opción 'Reducir movimiento' en tu dispositivo. Las animaciones estarán desactivadas para una mejor experiencia.",
              [{ text: "Entendido" }]
            );
          }, 1000);
        }
      }
    };

    checkReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setSystemReduceMotion(enabled);
        if (enabled) {
          setAnimationsPaused(true);
          stopLoginBurbujas();
          stopRegisterBurbujas();
          stopWelcomeAnimations();
          
          Alert.alert(
            "Animaciones Desactivadas",
            "Se activó la opción 'Reducir movimiento'. Las animaciones estarán desactivadas.",
            [{ text: "Entendido" }]
          );
        } else {
          Alert.alert(
            "Animaciones Activadas",
            "Se desactivó 'Reducir movimiento'. Las animaciones están disponibles nuevamente.",
            [{ text: "¡Genial!" }]
          );
        }
      }
    );

    return () => {
      subscription.remove();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [settingsLoaded]);

  const playAudio = async (soundFile: any) => {
    try {
      if (!settingsLoaded || soundPaused) {
        return;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(soundFile);
      soundRef.current = sound;
      
      if (!soundPaused) {
        await sound.playAsync();
      }
    } catch (error) {
      console.log("Error al reproducir audio:", error);
    }
  };

  const stopAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
    } catch (error) {
      console.log("Error al detener audio:", error);
    }
  };

  const toggleSound = async () => {
    try {
      const newSoundPaused = !soundPaused;
      setSoundPaused(newSoundPaused);
      
      await AsyncStorage.setItem('soundPaused', JSON.stringify(newSoundPaused));
      
      const s = soundRef.current;
      if (!s) return;
      
      const status = await s.getStatusAsync();
      if (status.isLoaded) {
        if (newSoundPaused) {
          await s.pauseAsync();
        } else {
          await s.playAsync();
        }
      }
    } catch (error) {
      console.log('Error toggling sound:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      const s = soundRef.current;
      if (!s) return;
      await s.setVolumeAsync(volume);
    } catch (error) {
      console.log('Error setting volume:', error);
    }
  };

  const toggleAnimations = () => {
    if (systemReduceMotion) {
      Alert.alert(
        "Animaciones No Disponibles",
        "Tienes activada la opción 'Reducir movimiento' en la configuración de tu dispositivo. Para activar las animaciones, desactiva esta opción en Configuración > Accesibilidad.",
        [{ text: "Entendido" }]
      );
      return;
    }

    const newAnimationsPaused = !animationsPaused;
    setAnimationsPaused(newAnimationsPaused);
    
    AsyncStorage.setItem('animationsPaused', JSON.stringify(newAnimationsPaused));

    if (newAnimationsPaused) {
      stopLoginBurbujas();
      stopRegisterBurbujas();
      stopWelcomeAnimations();
    } else {
      startLoginBurbujas();
      startRegisterBurbujas();
      startWelcomeAnimations();
    }
  };

  const startLoginBurbujas = () => {
    if (animationsPaused || systemReduceMotion) return;
    
    loginAnimationsActiveRef.current = true;
    
    if (!loginBurbujas || loginBurbujas.length === 0) return;
    
    loginBurbujas.forEach((burbuja) => {
      const animateBurbuja = () => {
        if (!loginAnimationsActiveRef.current) return;
        
        Animated.timing(burbuja.animation, {
          toValue: 1,
          duration: 10000 + Math.random() * 10000,
          delay: burbuja.delay,
          useNativeDriver: true
        }).start(() => {
          if (!loginAnimationsActiveRef.current) return;
          burbuja.animation.setValue(0);
          animateBurbuja();
        });
      };
      
      animateBurbuja();
    });
  };

  const stopLoginBurbujas = () => {
    loginAnimationsActiveRef.current = false;
    if (loginBurbujas) {
      loginBurbujas.forEach((burbuja) => {
        try {
          burbuja.animation.stopAnimation();
        } catch (e) {}
      });
    }
  };

  const startRegisterBurbujas = () => {
    if (animationsPaused || systemReduceMotion) return;
    
    registerAnimationsActiveRef.current = true;
    
    if (!registerBurbujas || registerBurbujas.length === 0) return;
    
    registerBurbujas.forEach((burbuja) => {
      const animateBurbuja = () => {
        if (!registerAnimationsActiveRef.current) return;
        
        Animated.timing(burbuja.animation, {
          toValue: 1,
          duration: 8000 + Math.random() * 7000,
          delay: burbuja.delay,
          useNativeDriver: true
        }).start(() => {
          if (!registerAnimationsActiveRef.current) return;
          burbuja.animation.setValue(0);
          animateBurbuja();
        });
      };
      
      animateBurbuja();
    });
  };

  const stopRegisterBurbujas = () => {
    registerAnimationsActiveRef.current = false;
    if (registerBurbujas) {
      registerBurbujas.forEach((burbuja) => {
        try {
          burbuja.animation.stopAnimation();
        } catch (e) {}
      });
    }
  };

  const createWelcomeAnimation = (animation: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animation, { 
          toValue: 1, 
          duration: 500, 
          useNativeDriver: true 
        }),
        Animated.delay(500),
        Animated.timing(animation, { 
          toValue: 0, 
          duration: 500, 
          useNativeDriver: true 
        }),
      ])
    );
  };

  const startWelcomeAnimations = () => {
    if (animationsPaused || systemReduceMotion) return;

    anim1Ref.current = createWelcomeAnimation(topLeftOpacity, 0);
    anim2Ref.current = createWelcomeAnimation(topRightOpacity, 500);
    anim3Ref.current = createWelcomeAnimation(bottomLeftOpacity, 1000);
    anim4Ref.current = createWelcomeAnimation(bottomRightOpacity, 1500);

    anim1Ref.current.start();
    anim2Ref.current.start();
    anim3Ref.current.start();
    anim4Ref.current.start();
  };

  const stopWelcomeAnimations = () => {
    anim1Ref.current?.stop();
    anim2Ref.current?.stop();
    anim3Ref.current?.stop();
    anim4Ref.current?.stop();
  };

  const value: AppSettingsContextType = {
    soundRef,
    soundPaused,
    toggleSound,
    setVolume,
    playAudio,
    stopAudio,
    animationsPaused,
    toggleAnimations,
    systemReduceMotion,
    loginBurbujas,
    startLoginBurbujas,
    stopLoginBurbujas,
    registerBurbujas,
    startRegisterBurbujas,
    stopRegisterBurbujas,
    topLeftOpacity,
    topRightOpacity,
    bottomLeftOpacity,
    bottomRightOpacity,
    startWelcomeAnimations,
    stopWelcomeAnimations
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("useAppSettings debe ser usado dentro de un AppSettingsProvider");
  }
  return context;
};