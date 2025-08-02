import React, { useState, useEffect, useRef } from "react";
import { View, Text,TextInput,TouchableOpacity,Alert,Image,Animated,Dimensions,StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import styles from "../themes/LoginStyles";

const LoginScreen = () => {
    const { width, height } = Dimensions.get("window");
    const navigation = useNavigation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const NUMERO_BURBUJAS = 40;
    const burbujaImage = require('./../../assets/images/numero.png');
    
    const burbujas = Array.from({ length: NUMERO_BURBUJAS }, () => ({
        animation: useRef(new Animated.Value(0)).current,
        startX: Math.random() * width,
        driftX: (Math.random() - 0.5) * 200,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 8000,
        startY: height + 100,  
        endY: -200,           
        size: 30 + Math.random() * 70
    }));

    useEffect(() => {
        burbujas.forEach((burbuja) => {
            const animateBurbuja = () => {
                Animated.timing(burbuja.animation, {
                    toValue: 1,
                    duration: 10000 + Math.random() * 10000,
                    delay: burbuja.delay,
                    useNativeDriver: true
                }).start(() => {
                    burbuja.animation.setValue(0);
                    animateBurbuja();
                });
            };
            animateBurbuja();
        });
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa tus credenciales.");
            return;
        }

        try {
            const data = await loginUser(email, password);

            if (data.token) {
                await AsyncStorage.setItem("token", data.token);
                await login(data.token);
                Alert.alert("Éxito", "Inicio de sesión exitoso");
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }], 
                });
            } else {
                const errorMsg = data?.msg || data?.message || "Credenciales incorrectas";
                Alert.alert("Error", errorMsg);
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Error de conexión";
            Alert.alert("Error", msg);
        }
    };

    return (
        <View style={styles.container}>
            {/* CAPA DE BURBUJAS (absolute, zIndex: 2) */}
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                {burbujas.map((burbuja, index) => {
                    const translateY = burbuja.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [burbuja.startY, burbuja.endY],
                    });

                    const translateX = burbuja.animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, burbuja.driftX, burbuja.driftX * 1.5],
                    });

                    const opacity = burbuja.animation.interpolate({
                        inputRange: [0, 0.2, 0.8, 1],
                        outputRange: [0, 1, 1, 0],
                    });

                    return (
                        <Animated.Image
                            key={`bubble-${index}`}
                            source={burbujaImage}
                            style={{
                                position: 'absolute',
                                opacity,
                                width: burbuja.size,
                                height: burbuja.size,
                                left: burbuja.startX,
                                transform: [
                                    { translateX },
                                    { translateY },
                                    { scale: burbuja.scale }
                                ]
                            }}
                        />
                    );
                })}
            </View>

            {/* FORMULARIO (zIndex: 1) */}
            <View style={styles.card}>
                <Image
                    source={require("../../assets/images/login1.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Iniciar Sesión</Text>
                
                <TextInput
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                
                <TextInput
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.footerLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;