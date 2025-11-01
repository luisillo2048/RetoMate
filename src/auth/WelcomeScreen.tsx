import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from "../context/AppSettingsContext";
import { useWelcomePrivacy } from "../hooks/useWelcomePrivacy";
import { PrivacyModal } from "../components/PrivacyModal";
import { SettingsMenu } from "../components/SettingsMenu";
import { AnimatedCorners } from "../components/AnimatedCorners";
import { MainContent } from "../components/MainContent";
import styles from "../themes/Styles";

const welcomeSound = require("../../assets/audios/welcome.mp3");

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  
  const {
    animationsPaused,
    playAudio,
    startWelcomeAnimations,
    stopWelcomeAnimations
  } = useAppSettings();

  const {
    showPrivacyModal,
    handleAcceptPrivacy,
    handleRejectPrivacy
  } = useWelcomePrivacy();

  useEffect(() => {
    // Reproducir audio de bienvenida (solo si el sonido no está pausado)
    playAudio(welcomeSound);
    
    // Iniciar animaciones si no están pausadas
    if (!animationsPaused) {
      startWelcomeAnimations();
    }

    return () => {
      stopWelcomeAnimations();
    };
  }, [animationsPaused]);

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      {/* Modal de Privacidad */}
      <PrivacyModal
        visible={showPrivacyModal}
        onAccept={handleAcceptPrivacy}
        onReject={handleRejectPrivacy}
      />

      {/* Controles en la parte superior */}
      <View style={[styles.topControlsRow, { marginTop: insets.top }]}>
        <SettingsMenu variant="welcome" />
      </View>

      {/* Esquinas animadas */}
      <AnimatedCorners />

      {/* Contenido principal */}
      <MainContent />
    </SafeAreaView>
  );
};

export default WelcomeScreen;