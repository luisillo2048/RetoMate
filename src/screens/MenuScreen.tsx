// screens/MenuScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserLevel } from "../context/UserLevelContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import styles from "../themes/MenuStyles";
import ChatBot from "./ChatBot";

const { width, height } = Dimensions.get('window');

const MenuScreen = () => {
  const navigation = useNavigation();
  const { block } = useUserLevel();
  const { theme, toggleTheme, colors } = useTheme();
  const { logout } = useAuth();

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Referencia para el ScrollView
  const scrollViewRef = useRef(null);
  
  // Animaciones
  const bounceAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  const drawerSlideAnim = useState(new Animated.Value(-300))[0];
  
  // Nueva animación para el movimiento del chatbot con el scroll
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
      // El chatbot se moverá en la dirección opuesta al scroll para dar efecto de parallax
      chatBotTranslateY.setValue(-value * 0.3); // 0.3 es la velocidad del parallax
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, []);

  // Abrir drawer con animación
  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // Cerrar drawer con animación
  const closeDrawer = () => {
    Animated.timing(drawerSlideAnim, {
      toValue: -300,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  // Manejar logout de manera segura
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Primero cerramos el drawer
      closeDrawer();
      
      // Esperamos un poco para que la animación del drawer termine
      setTimeout(async () => {
        await logout();
        // Usamos navigate en lugar de reset para evitar problemas
        navigation.navigate("Login" as never);
      }, 350);
    } catch (error) {
      console.error('Error durante logout:', error);
      setIsLoggingOut(false);
    }
  };

  // Función simple de audio placeholder
  const playAudio = (audioType: string) => {
    console.log(`Reproduciendo audio: ${audioType}`);
    // Aquí puedes agregar la funcionalidad de audio más tarde
    // Por ahora solo es un placeholder
  };

  // Contenido educativo para el menú principal
  const educationalContent = [
    {
      title: "¡Aprende Jugando! 🎲",
      description: "Descubre cómo los números pueden ser divertidos. Aprenderás a contar, sumar y restar mientras te diviertes.",
      icon: "🎯",
      color: [colors.primary, colors.secondary],
      audioType: "learn"
    },
    {
      title: "Tu Amigo Digital 🤖",
      description: "Nuestro chatbot te ayudará en todo momento. Puedes preguntarle sobre matemáticas o pedirle ayuda cuando te sientas atascado.",
      icon: "🤖",
      color: [colors.secondary, colors.primary],
      audioType: "chatbot"
    },
    {
      title: "Gana Premios 🏆",
      description: "Cada vez que aprendas algo nuevo, ganarás estrellas y medallas. ¡Colecciona todas!",
      icon: "⭐",
      color: [colors.accent, colors.primary],
      audioType: "achievements"
    },
    {
      title: "A Tu Propio Ritmo 🐢",
      description: "No hay prisa. Aprende cuando quieras y vuelve a las lecciones las veces que necesites.",
      icon: "📚",
      color: [colors.secondary, colors.accent],
      audioType: "pace"
    }
  ];

  // Función para manejar el scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <LinearGradient 
      colors={colors.background}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        {/* Drawer */}
        <Modal 
          visible={isDrawerVisible} 
          animationType="none" 
          transparent
          statusBarTranslucent
          onRequestClose={closeDrawer}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={closeDrawer}
            />
            <Animated.View 
              style={[
                styles.drawerContainer,
                {
                  transform: [{ translateX: drawerSlideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.drawerGradient}
              >
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>Configuración</Text>
                  <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                    <Feather name="x" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.drawerContent}>
                  {/* Opción de Tema */}
                  <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.drawerItem}
                    disabled={isLoggingOut}
                  >
                    <View style={styles.drawerIconContainer}>
                      <Feather
                        name={theme === "light" ? "moon" : "sun"}
                        size={24}
                        color="#FFF"
                      />
                    </View>
                    <View style={styles.drawerTextContainer}>
                      <Text style={styles.drawerText}>
                        {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
                      </Text>
                      <Text style={styles.drawerSubtext}>
                        {theme === "light" ? "Activar modo noche" : "Activar modo día"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Separador */}
                  <View style={styles.drawerSeparator} />

                  {/* Opción de Cerrar Sesión */}
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.drawerItem}
                    disabled={isLoggingOut}
                  >
                    <View style={styles.drawerIconContainer}>
                      <Feather 
                        name="log-out" 
                        size={24} 
                        color={isLoggingOut ? "rgba(255,255,255,0.5)" : "#FFF"} 
                      />
                    </View>
                    <View style={styles.drawerTextContainer}>
                      <Text style={[
                        styles.drawerText,
                        isLoggingOut && { color: "rgba(255,255,255,0.5)" }
                      ]}>
                        {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
                      </Text>
                      <Text style={[
                        styles.drawerSubtext,
                        isLoggingOut && { color: "rgba(255,255,255,0.5)" }
                      ]}>
                        Salir de la aplicación
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.drawerFooter}>
                  <Text style={styles.footerText}>Versión 1.0</Text>
                  <Text style={styles.footerText}>¡Aprende Divirtiéndote! 🎉</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>

        {/* Scroll Menu con espacio para el navbar */}
        <Animated.ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header Animado */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: bounceAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity
              onPress={openDrawer}
              style={styles.menuButton}
            >
              <Feather
                name="menu"
                size={28}
                color="#FFF"
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeTitle}>¡Hola, Amiguito! 👋</Text>
              <Text style={styles.subtitle}>Bienvenido a tu aventura de aprendizaje</Text>
            </View>
          </Animated.View>

          {/* Contenido Educativo Animado */}
          <View style={styles.contentContainer}>
            <Animated.View
              style={[
                styles.welcomeCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { 
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.welcomeCardGradient}
              >
                <View style={styles.welcomeHeader}>
                  <Text style={styles.welcomeCardTitle}>¡Comienza tu Aventura! 🚀</Text>
                </View>
                <Text style={styles.welcomeCardText}>
                  Aquí aprenderás matemáticas de una manera super divertida. 
                  Números, sumas, restas y mucho más te esperan.
                </Text>
                <View style={styles.welcomeEmojis}>
                  <Text style={styles.emojiLarge}>🔢</Text>
                  <Text style={styles.emojiLarge}>➕</Text>
                  <Text style={styles.emojiLarge}>➖</Text>
                  <Text style={styles.emojiLarge}>🎯</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Tarjetas de Descripción */}
            {educationalContent.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.descriptionCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { 
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.descriptionTouchable}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={item.color}
                    style={styles.descriptionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.descriptionHeader}>
                      <Text style={styles.descriptionIcon}>{item.icon}</Text>
                      <Text style={styles.descriptionTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Sección del Chatbot */}
            <Animated.View
              style={[
                styles.chatbotSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    { 
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.chatbotGradient}
              >
                <View style={styles.chatbotContent}>
                  <View style={styles.chatbotTextContainer}>
                    <Text style={styles.chatbotTitle}>Tu Ayudante Mágico 🧙‍♂️</Text>
                    <Text style={styles.chatbotDescription}>
                      Presiona el botón flotante para hablar con nuestro chatbot. 
                      Él te explicará ejercicios, responderá tus preguntas y te 
                      animará cuando lo necesites. ¡Es como tener un profesor 
                      siempre contigo!
                    </Text>
                  </View>
                  <View style={styles.chatbotIconContainer}>
                    <Text style={styles.chatbotEmoji}>🤖</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Barra de espacio para el navbar */}
            <View style={styles.navbarSpacer} />
          </View>
        </Animated.ScrollView>

        {/* Botón del Chatbot que se mueve con el scroll - POSICIÓN CORREGIDA */}
        <Animated.View
          style={[
            styles.chatBotButton,
            {
              transform: [
                { scale: pulseAnim },
                { 
                  translateY: Animated.add(
                    bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    }),
                    chatBotTranslateY
                  )
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => setChatVisible(true)}
            style={styles.chatButton}
          >
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              style={styles.chatButtonGradient}
            >
              <Image
                source={require("../../assets/images/chatbot.png")}
                style={styles.chatBotImage}
              />
              <View style={styles.notificationDot} />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Burbuja de mensaje */}
          <Animated.View 
            style={[
              styles.chatBubble,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.8, 1]
                })
              }
            ]}
          >
            <Text style={styles.chatBubbleText}>¡Tócame! 👋</Text>
          </Animated.View>
        </Animated.View>

        {/* ChatBot */}
        <ChatBot visible={chatVisible} onClose={() => setChatVisible(false)} />
      </View>
    </LinearGradient>
  );
};

export default MenuScreen;