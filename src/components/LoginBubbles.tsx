import React from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import { useAppSettings } from "../context/AppSettingsContext";

const burbujaImage = require('../../assets/images/numero.png');

export const LoginBubbles: React.FC = () => {
  const { loginBurbujas } = useAppSettings();

  
  if (!loginBurbujas || !Array.isArray(loginBurbujas) || loginBurbujas.length === 0) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {loginBurbujas.map((burbuja, index) => {
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
            key={`login-bubble-${index}`}
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
  );
};