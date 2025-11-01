import React from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/MenuStyles";

interface WelcomeCardProps {
  fadeAnim: Animated.Value;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ fadeAnim }) => {
  const { colors } = useTheme();

  return (
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
  );
};