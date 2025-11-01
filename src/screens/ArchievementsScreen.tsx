import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  Animated, 
  Easing, 
  Dimensions,
  RefreshControl 
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Logro, Estadisticas } from "../types/achievements";
import styles from '../themes/LogrosStyles';
import { globalStyles } from "../themes/globalStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
  
const { width } = Dimensions.get('window');
const isSmallPhone = width < 375;

const AchievementsScreen = () => {
  const { theme, colors } = useTheme();
  const { user } = useAuth();
  const [logros, setLogros] = useState<Logro[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spentPoints, setSpentPoints] = useState<number>(0);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  
  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Cargar puntos gastados
  const loadSpentPoints = async (): Promise<number> => {
    try {
      if (!user?.id) return 0;
      const SPENT_POINTS_KEY = `spent_points_${user.id}`;
      const savedSpentPoints = await AsyncStorage.getItem(SPENT_POINTS_KEY);
      return savedSpentPoints ? parseInt(savedSpentPoints) : 0;
    } catch (error) {
      return 0;
    }
  };

  const fetchMisLogros = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("¡Ups!", "Necesitas iniciar sesión para ver tus logros");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(`${API_URL}/logro/mislogros`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error en el servidor');
      }
      
      const data = await response.json();
      setLogros(data.logros || []);
      setEstadisticas(data.estadisticas || null);
      
      // Cargar puntos gastados y calcular puntos disponibles
      const spent = await loadSpentPoints();
      setSpentPoints(spent);
      
      // Calcular puntos disponibles (puntaje total - puntos gastados)
      const totalFromAPI = data.estadisticas?.puntaje_total || 0;
      const available = Math.max(0, totalFromAPI - spent);
      setAvailablePoints(available);
      
      // Iniciar animaciones cuando los datos estén listos
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        })
      ]).start();
      
    } catch (error) {
      console.error("Error al obtener logros:", error);
      Alert.alert("¡Ups!", "No pudimos cargar tus logros. ¡Intenta de nuevo!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMisLogros();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMisLogros();
    }
  }, [user]);

  // Colores para los gradientes de logros desbloqueados
  const getUnlockedGradientColors = (index: number) => {
    const gradients = [
      ['#FF6B6B', '#FFD93D'], // Rojo a amarillo
      ['#6BCF7F', '#4D96FF'], // Verde a azul
      ['#B465FF', '#FF6B9D'], // Morado a rosa
      ['#4ECDC4', '#44A08D'], // Turquesa a verde azulado
      ['#FF9E6D', '#FF6B6B'], // Naranja a rojo
      ['#4D96FF', '#6BCF7F'], // Azul a verde
    ];
    return gradients[index % gradients.length];
  };

  // Colores para los gradientes de logros bloqueados
  const getLockedGradientColors = (index: number) => {
    const gradients = [
      ['#E0E0E0', '#BDBDBD'], // Gris claro a gris medio
      ['#F5F5F5', '#E0E0E0'], // Blanco a gris claro
      ['#EEEEEE', '#CFCFCF'], // Gris muy claro a gris
    ];
    return gradients[index % gradients.length];
  };

  const renderProgress = (logro: Logro) => {
    if (logro.desbloqueado) {
      return (
        <View style={styles.unlockedProgress}>
          <Ionicons name="trophy" size={isSmallPhone ? 20 : 24} color="#FFD700" />
          <Text style={styles.unlockedText}>¡DESBLOQUEADO! 🎊</Text>
        </View>
      );
    }

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressLabel, { color: '#FFF' }]}>
            Progreso: {logro.progreso_actual || 0}/{logro.meta}
          </Text>
          <Text style={[styles.percentage, { color: '#FFF' }]}>
            {Math.round(logro.porcentaje || 0)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${logro.porcentaje || 0}%` }
            ]}
          />
        </View>
      </View>
    );
  };

  // Calcular puntos de recompensa del logro
  const calculateRewardPoints = (logro: Logro): number => {
    return logro.meta * 10; // Misma lógica que tenías
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={colors.background}
        style={[styles.container, styles.centered]}
      >
        <MaterialCommunityIcons name="trophy-award" size={isSmallPhone ? 50 : 60} color={colors.primary} />
        <Text style={[styles.title, { marginTop: 20, color: colors.text }]}>
          Cargando tus logros...
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          ¡Prepárate para ver tus premios!
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={colors.background}
      style={styles.container}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            title="Actualizando logros..."
            titleColor="#666"
          />
        }
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >
          {/* Encabezado */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Mis Logros 🏆
              </Text>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                Gana puntos y desbloquea premios especiales
              </Text>
            </View>
            <View style={styles.trophyContainer}>
              <MaterialCommunityIcons name="trophy" size={isSmallPhone ? 28 : 32} color={colors.primary} />
            </View>
          </View>

          {/* Estadísticas MEJORADAS con puntos disponibles - SOLO UNA VEZ */}
          {estadisticas && (
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Ionicons name="checkmark-circle" size={isSmallPhone ? 20 : 24} color="#FFF" />
                </View>
                <Text style={[styles.statNumber, { color: '#FFF' }]}>
                  {estadisticas.tareas_completadas}
                </Text>
                <Text style={[styles.statLabel, { color: '#FFF' }]}>
                  Tareas
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Ionicons name="star" size={isSmallPhone ? 20 : 24} color="#FFF" />
                </View>
                <Text style={[styles.statNumber, { color: '#FFF' }]}>
                  {estadisticas.puntaje_total}
                </Text>
                <Text style={[styles.statLabel, { color: '#FFF' }]}>
                  Ganados
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Ionicons name="diamond" size={isSmallPhone ? 20 : 24} color="#FFF" />
                </View>
                <Text style={[styles.statNumber, { color: '#FFF' }]}>
                  {availablePoints}
                </Text>
                <Text style={[styles.statLabel, { color: '#FFF' }]}>
                  Disponibles
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Ionicons name="game-controller" size={isSmallPhone ? 20 : 24} color="#FFF" />
                </View>
                <Text style={[styles.statNumber, { color: '#FFF' }]}>
                  {spentPoints}
                </Text>
                <Text style={[styles.statLabel, { color: '#FFF' }]}>
                  Gastados
                </Text>
              </View>
            </LinearGradient>
          )}

          {/* Logros */}
          <View style={styles.achievementsList}>
            {logros.length === 0 ? (
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.emptyState}
              >
                <Text style={styles.emptyIcon}>🎮</Text>
                <Text style={[styles.emptyTitle, { color: '#FFF' }]}>
                  ¡Comienza tu aventura!
                </Text>
                <Text style={[styles.emptyDescription, { color: '#FFF' }]}>
                  Completa tareas para ganar puntos y desbloquear premios especiales
                </Text>
                <Text style={[styles.emptyHint, { color: '#FFF' }]}>
                  ⬇️ Desliza hacia abajo para actualizar
                </Text>
              </LinearGradient>
            ) : (
              logros.map((achievement: Logro, index: number) => (
                <LinearGradient
                  key={achievement._id || `logro-${index}`}
                  colors={achievement.desbloqueado ? 
                    getUnlockedGradientColors(index) : 
                    getLockedGradientColors(index)
                  }
                  style={styles.achievementCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.textContainer}>
                      <View style={styles.titleContainer}>
                        <Text style={[
                          styles.achievementIcon,
                          { color: achievement.desbloqueado ? '#FFF' : '#666' }
                        ]}>
                          {achievement.icon}
                        </Text>
                        <View style={styles.textContent}>
                          <Text style={[styles.achievementTitle, { color: achievement.desbloqueado ? '#FFF' : '#333' }]}>
                            {achievement.logro}
                          </Text>
                          <Text style={[styles.achievementDescription, { color: achievement.desbloqueado ? 'rgba(255,255,255,0.9)' : '#666' }]}>
                            {achievement.descripcion}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.iconContainer}>
                      {achievement.desbloqueado ? (
                        <Ionicons name="checkmark-circle" size={isSmallPhone ? 28 : 32} color="#FFF" />
                      ) : (
                        <Ionicons name="lock-closed" size={isSmallPhone ? 28 : 32} color="rgba(0,0,0,0.5)" />
                      )}
                    </View>
                  </View>

                  {/* Progreso o estado desbloqueado */}
                  {renderProgress(achievement)}

                  {/* Puntos del logro */}
                  <View style={styles.pointsContainer}>
                    <Ionicons name="diamond" size={isSmallPhone ? 14 : 16} color={achievement.desbloqueado ? '#FFD700' : colors.primary} />
                    <Text style={[styles.pointsText, { color: achievement.desbloqueado ? '#FFF' : '#333' }]}>
                      Recompensa: {calculateRewardPoints(achievement)} puntos
                    </Text>
                  </View>

                  {/* Estado de puntos */}
                  {!achievement.desbloqueado && (
                    <View style={styles.pointsStatus}>
                      <Ionicons name="information-circle" size={14} color={achievement.desbloqueado ? '#FFF' : '#FF9800'} />
                      <Text style={[styles.pointsStatusText, { color: achievement.desbloqueado ? 'rgba(255,255,255,0.9)' : '#666' }]}>
                        Al desbloquear: +{calculateRewardPoints(achievement)} puntos a tu total
                      </Text>
                    </View>
                  )}

                  {/* Fecha de desbloqueo */}
                  {achievement.desbloqueado && achievement.fecha_desbloqueo && (
                    <Text style={[styles.unlockDate, { color: 'rgba(255,255,255,0.8)' }]}>
                      🎊 Desbloqueado: {new Date(achievement.fecha_desbloqueo).toLocaleDateString('es-ES')}
                    </Text>
                  )}
                </LinearGradient>
              ))
            )}
          </View>

          {/* Información adicional sobre puntos */}
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={styles.infoCard}
          >
            <Text style={[styles.infoTitle, { color: '#FFF' }]}>
              💡 ¿Cómo funcionan los puntos?
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="add-circle" size={16} color="#FFF" />
                <Text style={[styles.infoText, { color: '#FFF' }]}>
                  Ganas puntos completando tareas y logros
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="remove-circle" size={16} color="#FFF" />
                <Text style={[styles.infoText, { color: '#FFF' }]}>
                  Gastas puntos comprando juegos en la tienda
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="alert-circle" size={16} color="#FFF" />
                <Text style={[styles.infoText, { color: '#FFF' }]}>
                  Tus puntos disponibles son: Ganados - Gastados
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Espacio extra para asegurar que se pueda scrollear completamente */}
          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AchievementsScreen;