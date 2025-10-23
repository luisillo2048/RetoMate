import React, { useState, useEffect, useRef } from "react";
import { View, Text,TextInput,TouchableOpacity,Alert,Image,Animated,Dimensions,StyleSheet, AccessibilityInfo } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import styles from "../themes/LoginStyles";
import commonStyles from "../themes/Styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
    const { width, height } = Dimensions.get("window");
    const navigation = useNavigation();
    const { login } = useAuth();
    const insets = useSafeAreaInsets();

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

    // control de pausa para animaciones
    const animationsActiveRef = useRef(true);
    const [animationsPaused, setAnimationsPaused] = useState(false);
    const [soundPaused, setSoundPaused] = useState(false);
    const [systemReduceMotion, setSystemReduceMotion] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);

    // Audio file
    const welcomeSound = require("../../assets/audios/welcome.mp3");

    const startAllBurbujas = () => {
        animationsActiveRef.current = true;
        burbujas.forEach((burbuja) => {
            const animateBurbuja = () => {
                if (!animationsActiveRef.current) return;
                Animated.timing(burbuja.animation, {
                    toValue: 1,
                    duration: 10000 + Math.random() * 10000,
                    delay: burbuja.delay,
                    useNativeDriver: true
                }).start(() => {
                    if (!animationsActiveRef.current) return;
                    burbuja.animation.setValue(0);
                    animateBurbuja();
                });
            };
            animateBurbuja();
        });
    };

    const stopAllBurbujas = () => {
        animationsActiveRef.current = false;
        burbujas.forEach((burbuja) => {
            try {
                burbuja.animation.stopAnimation();
            } catch (e) {
                // noop
            }
        });
    };

    // Detectar preferencia del sistema para reducir animaciones
    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
            setSystemReduceMotion(enabled);
            if (enabled) {
                stopAllBurbujas();
                setAnimationsPaused(true);
            }
        });

        const subscription = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            enabled => {
                setSystemReduceMotion(enabled);
                if (enabled) {
                    stopAllBurbujas();
                    setAnimationsPaused(true);
                }
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // iniciar animaciones y audio solo si el sistema no requiere reducir movimiento
        const setup = async () => {
            if (!systemReduceMotion && !animationsPaused) {
                startAllBurbujas();
            }

            try {
                const s = new Audio.Sound();
                await s.loadAsync(welcomeSound);
                soundRef.current = s;
                await s.playAsync();
                setSoundPaused(false);
            } catch (error) {
                console.log('Error al cargar/reproducir audio en LoginScreen:', error);
            }
        };

        setup();

        return () => {
            stopAllBurbujas();
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => {});
                soundRef.current = null;
            }
        };
    }, [systemReduceMotion]);

    const toggleAnimations = () => {
        if (!animationsPaused) {
            stopAllBurbujas();
            setAnimationsPaused(true);
        } else {
            startAllBurbujas();
            setAnimationsPaused(false);
        }
    };

    const toggleSound = async () => {
        try {
            const s = soundRef.current;
            if (!s) {
                setSoundPaused((v) => !v);
                return;
            }
            const status = await s.getStatusAsync();
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await s.pauseAsync();
                    setSoundPaused(true);
                } else {
                    await s.playAsync();
                    setSoundPaused(false);
                }
            }
        } catch (error: any) {
            console.log('Error toggling sound:', error);
        }
    };

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
                (navigation as any).reset({
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

    const usernameRef = useRef<TextInput>(null);
    const passwdRef = useRef<TextInput>(null);

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]}> 
            {/* controles superiores: pausar animaciones / sonido */}
            <View style={[commonStyles.topControlsRow, { marginTop: insets.top }]} pointerEvents="box-none">
                <TouchableOpacity
                    onPress={toggleAnimations}
                    style={[commonStyles.pauseButton, animationsPaused ? commonStyles.pauseButtonSelected : null]}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={animationsPaused ? 'Reanudar animaciones' : 'Pausar animaciones'}
                >
                    <MaterialCommunityIcons name="animation" size={20} color={animationsPaused ? 'gray' : 'black'} />
                    <Text style={commonStyles.pauseButtonText}>{animationsPaused ? 'Reanudar' : 'Pausar'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleSound}
                    style={[commonStyles.pauseButton, soundPaused ? commonStyles.pauseButtonSelected : null]}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={soundPaused ? 'Reanudar sonido' : 'Silenciar sonido'}
                >
                    <MaterialCommunityIcons name={soundPaused ? 'volume-off' : 'volume-high'} size={20} color={soundPaused ? 'gray' : 'black'} />
                    <Text style={commonStyles.pauseButtonText}>{soundPaused ? 'Reanudar' : 'Silenciar'}</Text>
                </TouchableOpacity>
            </View>
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
                    ref={usernameRef}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onSubmitEditing={() => passwdRef.current?.focus()}
                    returnKeyType="next"
                />
                
                <TextInput
                    ref={passwdRef}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
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
                    <TouchableOpacity onPress={() => (navigation as any).navigate("Register")}>
                        <Text style={styles.footerLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;