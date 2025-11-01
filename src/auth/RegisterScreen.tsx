import React, { useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from "../context/AppSettingsContext";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { RegisterBubbles } from "../components/RegisterBubbles";
import { RegisterForm } from "../components/RegisterForm";
import { SettingsMenu } from "../components/SettingsMenu"; 
import { globalStyles } from "../themes/globalStyles";
import commonStyles from "../themes/Styles";

const welcomeSound = require("../../assets/audios/welcome.mp3");

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();

  const {
    animationsPaused,
    playAudio,
    startRegisterBurbujas,
    stopRegisterBurbujas
  } = useAppSettings();

  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    grado,
    setGrado,
    codigo_maestro,
    setCodigoMaestro,
    usernameRef,
    emailRef,
    passwdRef,
    passwd2Ref,
    handleRegister,
    navigateToLogin
  } = useRegisterForm();

  useEffect(() => {
    playAudio(welcomeSound);
    
    if (!animationsPaused) {
      startRegisterBurbujas();
    }

    return () => {
      stopRegisterBurbujas();
    };
  }, [animationsPaused]);

  return (
    <SafeAreaView style={[globalStyles.container, { flex: 1, backgroundColor: '#87CEEB' }]}>
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
            <SettingsMenu variant="register" />
          </View>
          
          <RegisterBubbles />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
            <RegisterForm
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              grado={grado}
              setGrado={setGrado}
              codigo_maestro={codigo_maestro}
              setCodigoMaestro={setCodigoMaestro}
              usernameRef={usernameRef}
              emailRef={emailRef}
              passwdRef={passwdRef}
              passwd2Ref={passwd2Ref}
              onRegister={handleRegister}
              onNavigateToLogin={navigateToLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;