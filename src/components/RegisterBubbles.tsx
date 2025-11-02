import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useAppSettings } from "../context/AppSettingsContext";

const burbujaImage = require("../../assets/images/animacionRegister.png");

export const RegisterBubbles: React.FC = () => {
  const { registerBurbujas } = useAppSettings();

  if (!registerBurbujas || !Array.isArray(registerBurbujas) || registerBurbujas.length === 0) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {registerBurbujas.map((burbuja, index) => {
        const translateY = burbuja.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [burbuja.startY, burbuja.endY],
        });

        const translateX = burbuja.animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, burbuja.driftX, burbuja.driftX * 1.3],
        });

        const opacity = burbuja.animation.interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.Image
            key={`register-bubble-${index}`}
            source={burbujaImage}
            style={{
              position: "absolute",
              opacity,
              width: burbuja.size,
              height: burbuja.size,
              left: burbuja.startX,
              transform: [
                { translateX },
                { translateY },
                { scale: burbuja.scale },
              ],
            }}
          />
        );
      })}
    </View>
  );
};