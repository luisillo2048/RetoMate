import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { EducationalContent } from "../types/menu";
import styles from "../themes/MenuStyles";

interface EducationalCardsProps {
  educationalContent: EducationalContent[];
  fadeAnim: Animated.Value;
  onPlayAudio: (audioType: string) => void;
}

export const EducationalCards: React.FC<EducationalCardsProps> = ({
  educationalContent,
  fadeAnim,
  onPlayAudio
}) => {
  return (
    <>
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
            onPress={() => onPlayAudio(item.audioType)}
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
    </>
  );
};