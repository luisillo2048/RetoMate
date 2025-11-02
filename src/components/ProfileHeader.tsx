import React from "react";
import { View, Text, Image, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/ProfileStyles";

interface ProfileHeaderProps {
  bounceAnim: Animated.Value;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  logoSpinInterpolate: Animated.AnimatedInterpolation<string>;
  balloonTranslateY: Animated.AnimatedInterpolation<string>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  bounceAnim,
  slideAnim,
  fadeAnim,
  logoSpinInterpolate,
  balloonTranslateY
}) => {
  const auth = React.useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* PERFIL CON GRADIENTE ANIMADO */}
      <Animated.View 
        style={[
          styles.profileSection,
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
          colors={[colors.primary, colors.secondary]}
          style={styles.profileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* GLOBOS ANIMADOS */}
          <View style={styles.balloonsContainer}>
            <Animated.Text style={[styles.balloon, { transform: [{ translateY: balloonTranslateY }] }]}>🎈</Animated.Text>
            <Animated.Text style={[styles.balloon, { 
              transform: [{ translateY: balloonTranslateY }] 
            }]}>🎈</Animated.Text>
            <Animated.Text style={[styles.balloon, { 
              transform: [{ translateY: balloonTranslateY }] 
            }]}>🎈</Animated.Text>
          </View>

          {/* AVATAR ANIMADO */}
          <Animated.View 
            style={[
              styles.avatarContainer,
              { 
                transform: [
                  { rotate: logoSpinInterpolate },
                  { scale: bounceAnim }
                ] 
              }
            ]}
          >
            <Image
              source={require("../../assets/images/Logo.png")}
              style={styles.avatar}
            />
            <View style={styles.avatarGlow} />
          </Animated.View>

          <Text style={styles.title}>🌟 MI MUNDO MÁGICO 🌟</Text>
          
          {auth?.user ? (
            <>
              <View style={styles.userInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="person" size={20} color="#FFF" />
                  <Text style={styles.userText}>{auth.user.username}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Ionicons name="mail" size={20} color="#FFF" />
                  <Text style={styles.userText}>{auth.user.email}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <FontAwesome5 name="graduation-cap" size={18} color="#FFF" />
                  <Text style={styles.userText}>
                    {auth.user.grado || "Explorador Estelar"} 🎓
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.noUserContainer}>
              <Text style={styles.errorText}>🔒 ¡Inicia sesión para la aventura!</Text>
              <Text style={styles.subText}>
                Descubre un mundo de matemáticas divertidas
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
};