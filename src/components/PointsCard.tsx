import React from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/ProfileStyles";

interface PointsCardProps {
  bounceAnim: Animated.Value;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  rotateInterpolate: Animated.AnimatedInterpolation;
  totalPuntaje: number;
  spentPoints: number;
  availablePoints: number;
}

export const PointsCard: React.FC<PointsCardProps> = ({
  bounceAnim,
  slideAnim,
  fadeAnim,
  rotateInterpolate,
  totalPuntaje,
  spentPoints,
  availablePoints
}) => {
  const { colors } = useTheme();
  
  const progressPercentage = Math.min(availablePoints / 100, 1);

  return (
    <Animated.View 
      style={[
        styles.pointsCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: bounceAnim }
          ]
        }
      ]}
    >
      <LinearGradient
        colors={[colors.accent, colors.primary]}
        style={styles.pointsGradient}
      >
        <View style={styles.pointsHeader}>
          <Animated.View style={{ 
            transform: [
              { scale: bounceAnim },
              { rotate: rotateInterpolate }
            ] 
          }}>
            <FontAwesome5 name="gem" size={32} color="#FFD700" />
          </Animated.View>
          <Text style={styles.pointsTitle}>MIS TESOROS BRILLANTES 💎</Text>
        </View>

        <View style={styles.pointsGrid}>
          <View style={styles.pointItem}>
            <Text style={styles.pointLabel}>✨ Ganados</Text>
            <Text style={styles.pointValue}>{totalPuntaje} 🏆</Text>
          </View>
          
          <View style={styles.pointItem}>
            <Text style={styles.pointLabel}>🎮 Gastados</Text>
            <Text style={styles.pointValue}>{spentPoints} 🎯</Text>
          </View>
          
          <View style={styles.pointItem}>
            <Text style={styles.pointLabel}>💰 Disponibles</Text>
            <Text style={styles.pointValue}>{availablePoints} 💫</Text>
          </View>
        </View>

        {/* BARRA DE PROGRESO DIVERTIDA */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>Mi Camino Mágico</Text>
            <Text style={styles.progressText}>
              {availablePoints} / 100 puntos
            </Text>
          </View>
          
          <Progress.Bar
            progress={progressPercentage}
            width={null}
            height={20}
            color="#FFD700"
            unfilledColor="rgba(255,255,255,0.3)"
            borderWidth={0}
            borderRadius={10}
            style={styles.progressBar}
          />
          
          <View style={styles.progressMarks}>
            <Text style={styles.markText}>🐣 Novato</Text>
            <Text style={styles.markText}>🦁 Experto</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};