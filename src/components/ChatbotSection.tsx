import React from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/MenuStyles";

interface ChatbotSectionProps {
  fadeAnim: Animated.Value;
}

export const ChatbotSection: React.FC<ChatbotSectionProps> = ({ fadeAnim }) => {
  const { colors } = useTheme();

  return (
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
  );
};