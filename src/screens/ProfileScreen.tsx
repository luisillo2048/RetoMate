import React from "react";
import { View, FlatList, RefreshControl, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../hooks/useProfile";
import { useProfileAnimations } from "../hooks/useProfileAnimations";
import { ProfileHeader } from "../components/ProfileHeader";
import { PointsCard } from "../components/PointsCard";
import { LoadingScreen } from "../components/LoadingScreen";
import styles from "../themes/ProfileStyles";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const {
    loading,
    refreshing,
    totalPuntaje,
    spentPoints,
    availablePoints,
    onRefresh
  } = useProfile();

  const {
    bounceAnim,
    slideAnim,
    fadeAnim,
    rotateInterpolate,
    logoSpinInterpolate,
    balloonTranslateY
  } = useProfileAnimations();

  if (loading) {
    return (
      <LoadingScreen 
        bounceAnim={bounceAnim}
        logoSpinInterpolate={logoSpinInterpolate}
      />
    );
  }

  const renderHeader = () => (
    <View style={styles.container}>
      <ProfileHeader
        bounceAnim={bounceAnim}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
        logoSpinInterpolate={logoSpinInterpolate}
        balloonTranslateY={balloonTranslateY}
      />

      <PointsCard
        bounceAnim={bounceAnim}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
        rotateInterpolate={rotateInterpolate}
        totalPuntaje={totalPuntaje}
        spentPoints={spentPoints}
        availablePoints={availablePoints}
      />

      {/* BOTÓN PARA COMENZAR AVENTURA */}
      <Animated.View 
        style={[
          styles.startAdventureContainer,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => console.log("Navegar a juegos")}
        >
          {/* Contenido del botón */}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={() => "empty"}
        renderItem={null}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary, colors.accent]}
            tintColor={colors.primary}
            title="¡Actualizando magia! ✨"
            titleColor={colors.primary}
          />
        }
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={null}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default ProfileScreen;