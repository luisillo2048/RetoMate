import React, { useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from "../context/AppSettingsContext";
import { useLoginForm } from "../hooks/useLoginForm";
import { LoginBubbles } from "../components/LoginBubbles";
import { LoginForm } from "../components/LoginForm";
import { SettingsMenu } from "../components/SettingsMenu";
import { globalStyles } from "../themes/globalStyles";
import commonStyles from "../themes/Styles";

const welcomeSound = require("../../assets/audios/welcome.mp3");

const LoginScreen = () => {
  const insets = useSafeAreaInsets();

  const { 
    animationsPaused,
    playAudio,
    startLoginBurbujas,
    stopLoginBurbujas
  } = useAppSettings();

  const {
    email,
    setEmail,
    password,
    setPassword,
    usernameRef,
    passwdRef,
    handleLogin,
    navigateToRegister
  } = useLoginForm();

  useEffect(() => {
    playAudio(welcomeSound);
    
    if (!animationsPaused) {
      startLoginBurbujas();
    }

    return () => {
      stopLoginBurbujas();
    };
  }, [animationsPaused]);

  return (
    <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[commonStyles.topControlsRow, { marginTop: insets.top }]} pointerEvents="box-none">
            <SettingsMenu variant="login"/>
          </View>
          
          <LoginBubbles />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              usernameRef={usernameRef}
              passwdRef={passwdRef}
              onLogin={handleLogin}
              onNavigateToRegister={navigateToRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;