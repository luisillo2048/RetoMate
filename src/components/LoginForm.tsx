import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from "../themes/LoginStyles";
import { globalStyles } from "../themes/globalStyles";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  usernameRef: React.RefObject<any>;
  passwdRef: React.RefObject<any>;
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  usernameRef,
  passwdRef,
  onLogin,
  onNavigateToRegister
}) => {
  const acoplatedInputStyle = {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD166',
    fontSize: 16,
    color: '#030303ff',
    backgroundColor: '#FFF9F2',
  };

  return (
    <View style={styles.card}>
      <Image
        source={require("../../assets/images/login1.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Iniciar Sesión</Text>
      
      {/* Input de email con icono */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons 
          name="email" 
          size={24} 
          color="#FFD166" 
          style={styles.inputIcon}
        />
        <TextInput
          ref={usernameRef}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={acoplatedInputStyle}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => passwdRef.current?.focus()}
          returnKeyType="next"
        />
      </View>
      
      {/* Input de password con icono */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons 
          name="lock" 
          size={24} 
          color="#FFD166" 
          style={styles.inputIcon}
        />
        <TextInput
          ref={passwdRef}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={acoplatedInputStyle}
          onSubmitEditing={onLogin}
          returnKeyType="done"
        />
      </View>
      
      <TouchableOpacity 
        style={[globalStyles.button, { backgroundColor: '#FFD166' }]} 
        onPress={onLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={[styles.footerLink, { color: '#FFD166' }]}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};