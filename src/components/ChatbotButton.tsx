import React from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/MenuStyles";

interface ChatbotButtonProps {
  pulseAnim: Animated.Value;
  bounceAnim: Animated.Value;
  chatBotTranslateY: Animated.Value;
  onPress: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  pulseAnim,
  bounceAnim,
  chatBotTranslateY,
  onPress
}) => {
  const { colors } = useTheme();

  return (
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
        onPress={onPress}
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
        <Text style={styles.chatBubbleText}>¡Hola aqui estoy! 👋</Text>
      </Animated.View>
    </Animated.View>
  );
};