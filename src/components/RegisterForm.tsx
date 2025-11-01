import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/RegisterStyles";
import { globalStyles } from "../themes/globalStyles";

const registerImage = require("../../assets/images/register1.png");

interface RegisterFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  grado: string;
  setGrado: (grado: string) => void;
  codigo_maestro: string;
  setCodigoMaestro: (codigo: string) => void;
  usernameRef: React.RefObject<any>;
  emailRef: React.RefObject<any>;
  passwdRef: React.RefObject<any>;
  passwd2Ref: React.RefObject<any>;
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
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
  onRegister,
  onNavigateToLogin
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollContainer}
      style={[
        globalStyles.container,
        theme === "light" ? styles.lightContainer : styles.darkContainer,
      ]}
    >
      {/* Caja principal */}
      <View style={styles.mainBox}>
        <Image
          source={registerImage}
          style={styles.headerImage as any}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <MaterialCommunityIcons name="star" size={32} color="#FFD700" />
          <Text style={styles.title}>¡Vamos a Aprender!</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="#FF6B6B"
              style={styles.icon}
            />
            <TextInput
              ref={usernameRef}
              placeholder="Tu nombre divertido"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              style={globalStyles.input}
              onSubmitEditing={() => emailRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Correo */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              color="#4ECDC4"
              style={styles.icon}
            />
            <TextInput
              ref={emailRef}
              placeholder="Correo (si tienes uno)"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={globalStyles.input}
              onSubmitEditing={() => passwdRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color="#FFA07A"
              style={styles.icon}
            />
            <TextInput
              ref={passwdRef}
              placeholder="Contraseña secreta"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={globalStyles.input}
              onSubmitEditing={() => passwd2Ref.current?.focus()}
              returnKeyType="next"
            />
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={24}
              color="#98D8C8"
              style={styles.icon}
            />
            <TextInput
              ref={passwd2Ref}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={globalStyles.input}
              onSubmitEditing={onRegister}
              returnKeyType="next"
            />
          </View>

          {/* Selector de grado */}
          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons
              name="school"
              size={24}
              color="#4ECDC4"
              style={styles.icon}
            />
            <Picker
              selectedValue={grado}
              style={styles.picker}
              dropdownIconColor="#4ECDC4"
              onValueChange={(itemValue) => setGrado(itemValue)}
            >
              <Picker.Item label="Selecciona tu grado" value="" />
              <Picker.Item label="1A°" value="1A°" />
              <Picker.Item label="1B°" value="1B°" />
              <Picker.Item label="1C°" value="1C°" />
            </Picker>
          </View>

          {/* Código maestro */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="key"
              size={24}
              color="#4ECDC4"
              style={styles.icon}
            />
            <TextInput
              placeholder="Código del maestro"
              placeholderTextColor="#888"
              value={codigo_maestro}
              onChangeText={setCodigoMaestro}
              autoCapitalize="none"
              style={globalStyles.input}
            />
          </View>

          {/* Botón de registro */}
          <TouchableOpacity
            onPress={onRegister}
            style={globalStyles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>¡Empezar a Jugar!</Text>
            <MaterialCommunityIcons
              name="gamepad-variant"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Link para login */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.switchLink}>¡Entra aquí!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}; 