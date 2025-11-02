import React from "react";
import { Image, Animated } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from "../context/AppSettingsContext";
import styles from "../themes/Styles";

const holaabuImage = require("../../assets/images/holaabu.png");
const holaabuelitoImage = require("../../assets/images/holaabuelito.png");

export const AnimatedCorners: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { 
    topLeftOpacity, 
    topRightOpacity, 
    bottomLeftOpacity, 
    bottomRightOpacity 
  } = useAppSettings();

  return (
    <>
      <Animated.View style={[
        styles.cornerImageContainer, 
        { top: 20 + insets.top, left: 20, opacity: topLeftOpacity }
      ]}>
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View style={[
        styles.cornerImageContainer, 
        { top: 20 + insets.top, right: 20, opacity: topRightOpacity }
      ]}>
        <Image source={holaabuelitoImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View style={[
        styles.cornerImageContainer, 
        { bottom: 20 + insets.bottom, left: 20, opacity: bottomLeftOpacity }
      ]}>
        <Image source={holaabuImage} style={styles.cornerImage} />
      </Animated.View>

      <Animated.View style={[
        styles.cornerImageContainer, 
        { bottom: 20 + insets.bottom, right: 20, opacity: bottomRightOpacity }
      ]}>
        <Image source={holaabuelitoImage} style={styles.cornerImage} />
      </Animated.View>
    </>
  );
};