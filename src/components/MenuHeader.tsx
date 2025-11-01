import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../themes/MenuStyles";

interface MenuHeaderProps {
  bounceAnim: Animated.Value;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  onOpenDrawer: () => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  bounceAnim,
  slideAnim,
  fadeAnim,
  onOpenDrawer
}) => {
  return (
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
        onPress={onOpenDrawer}
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
  );
};