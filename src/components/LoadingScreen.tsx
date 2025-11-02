import React from "react";
import { Text, Image, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/ProfileStyles";

interface LoadingScreenProps {
  bounceAnim: Animated.Value;
  logoSpinInterpolate: Animated.AnimatedInterpolation<string>; 
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  bounceAnim,
  logoSpinInterpolate
}) => {
  const { colors } = useTheme();

  const gradientColors = ['#4c669f', '#3b5998', '#192f6a'] as const;

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <Animated.View style={{ 
        transform: [
          { scale: bounceAnim },
          { rotate: logoSpinInterpolate }
        ] 
      }}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.loadingLogo}
        />
      </Animated.View>
      <Text style={[styles.loadingText, { color: colors.text }]}>🎉 Cargando tu mundo mágico...</Text>
      <Text style={[styles.subText, { color: colors.text }]}>Preparando sorpresas divertidas 🚀</Text>
    </LinearGradient>
  );
};