import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useMenu } from "../hooks/useMenu";
import { useMenuAnimations } from "../hooks/useMenuAnimations";
import { useMenuData } from "../hooks/useMenuData";
import { MenuHeader } from "../components/MenuHeader";
import { DrawerMenu } from "../components/DrawerMenu";
import { WelcomeCard } from "../components/WelcomeCard";
import { EducationalCards } from "../components/EducationalCards";
import { ChatbotSection } from "../components/ChatbotSection";
import { ChatbotButton } from "../components/ChatbotButton";
import ChatBot from "./ChatBot";
import { globalStyles } from "../themes/globalStyles";
import styles from "../themes/MenuStyles";

const MenuScreen = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const {
    isDrawerVisible,
    chatVisible,
    isLoggingOut,
    setChatVisible,
    openDrawer,
    closeDrawer,
    handleLogout,
    playAudio
  } = useMenu();

  const {
    bounceAnim,
    pulseAnim,
    slideAnim,
    fadeAnim,
    drawerSlideAnim,
    chatBotTranslateY,
    handleScroll,
    openDrawerAnimation,
    closeDrawerAnimation
  } = useMenuAnimations();

  const { educationalContent } = useMenuData();

  const scrollViewRef = useRef(null);

  const handleOpenDrawer = () => {
    openDrawer();
    openDrawerAnimation();
  };

  const handleCloseDrawer = () => {
    closeDrawerAnimation();
    setTimeout(() => {
      closeDrawer();
    }, 300);
  };

  return (
    <LinearGradient 
      colors={colors.background}
      style={globalStyles.container}
    >
      <View style={{ flex: 1 }}>
        {/* Drawer */}
        <DrawerMenu
          isVisible={isDrawerVisible}
          drawerSlideAnim={drawerSlideAnim}
          theme={theme}
          isLoggingOut={isLoggingOut}
          onClose={handleCloseDrawer}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        {/* Scroll Menu - SOLUCIÓN DEFINITIVA */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }} // SOLO ESTO CAMBIÉ - QUITÉ globalStyles.scrollContainer
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.scrollContent}
          // onScroll={handleScroll} // QUITADO
          scrollEventThrottle={16}
        >
          {/* Header Animado */}
          <MenuHeader
            bounceAnim={bounceAnim}
            slideAnim={slideAnim}
            fadeAnim={fadeAnim}
            onOpenDrawer={handleOpenDrawer}
          />

          {/* Contenido Educativo Animado */}
          <View style={styles.contentContainer}>
            <WelcomeCard fadeAnim={fadeAnim} />

            {/* Tarjetas de Descripción */}
            <EducationalCards
              educationalContent={educationalContent}
              fadeAnim={fadeAnim}
              onPlayAudio={playAudio}
            />

            {/* Sección del Chatbot */}
            <ChatbotSection fadeAnim={fadeAnim} />

            {/* Barra de espacio para el navbar */}
            <View style={styles.navbarSpacer} />
          </View>
        </ScrollView>

        {/* Botón del Chatbot que se mueve con el scroll */}
        <ChatbotButton
          pulseAnim={pulseAnim}
          bounceAnim={bounceAnim}
          chatBotTranslateY={chatBotTranslateY}
          onPress={() => setChatVisible(true)}
        />

        {/* ChatBot */}
        <ChatBot visible={chatVisible} onClose={() => setChatVisible(false)} />
      </View>
    </LinearGradient>
  );
};

export default MenuScreen;