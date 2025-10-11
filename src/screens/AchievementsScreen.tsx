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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import styles from '../themes/LogrosStyles';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api-node-js-production.up.railway.app';
  
const { width } = Dimensions.get('window');
const isSmallPhone = width < 375;

// Tipos
interface Logro {
  _id: string;
  logro: string;
  descripcion: string;
  icon: string;
  tipo: 'tareas_completadas' | 'puntaje' | 'bloque';
  meta: number;
  bloque?: number;
  desbloqueado: boolean;
  fecha_desbloqueo?: string;
  progreso_actual?: number;
  porcentaje?: number;
}

interface Estadisticas {
  tareas_completadas: number;
  puntaje_total: number;
  bloques_completados: number[];
  racha_actual: number;
}

const AchievementsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [logros, setLogros] = useState<Logro[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const fetchMisLogros = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Oops!", "Necesitas iniciar sesión para ver tus logros");
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

  const getCardStyle = (logro: Logro) => {
    const baseStyle = [
      styles.achievementCard,
      theme === 'light' ? styles.lightCard : styles.darkCard,
    ];

    if (logro.desbloqueado) {
      baseStyle.push(styles.unlockedCard);
    } else {
      baseStyle.push(styles.lockedCard);
    }

    return baseStyle;
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
          <Text style={[styles.progressLabel, theme === 'light' ? styles.lightText : styles.darkText]}>
            Progreso: {logro.progreso_actual || 0}/{logro.meta}
          </Text>
          <Text style={[styles.percentage, theme === 'light' ? styles.lightText : styles.darkText]}>
            {Math.round(logro.porcentaje || 0)}%
          </Text>
        </View>
        <View style={[styles.progressBar, theme === 'light' ? styles.lightProgressBar : styles.darkProgressBar]}>
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, theme === 'light' ? styles.lightContainer : styles.darkContainer]}>
        <MaterialCommunityIcons name="trophy-award" size={isSmallPhone ? 50 : 60} color="#4FC3F7" />
        <Text style={[styles.title, theme === 'light' ? styles.lightText : styles.darkText, { marginTop: 20 }]}>
          Cargando tus logros...
        </Text>
        <Text style={[styles.subtitle, theme === 'light' ? styles.lightText : styles.darkText]}>
          ¡Prepárate para ver tus premios!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, theme === 'light' ? styles.lightContainer : styles.darkContainer]}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4FC3F7']}
          tintColor="#4FC3F7"
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
            <Text style={[styles.title, theme === 'light' ? styles.lightText : styles.darkText]}>
              Mis Logros 🏆
            </Text>
            <Text style={[styles.subtitle, theme === 'light' ? styles.lightText : styles.darkText]}>
              Gana puntos y desbloquea premios especiales
            </Text>
          </View>
          <View style={styles.trophyContainer}>
            <MaterialCommunityIcons name="trophy" size={isSmallPhone ? 28 : 32} color="#4FC3F7" />
          </View>
        </View>

        {/* Estadísticas */}
        {estadisticas && (
          <View style={[styles.statsContainer, theme === 'light' ? styles.lightCard : styles.darkCard]}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E1F5FE' }]}>
                <Ionicons name="checkmark-circle" size={isSmallPhone ? 20 : 24} color="#0288D1" />
              </View>
              <Text style={[styles.statNumber, theme === 'light' ? styles.lightText : styles.darkText]}>
                {estadisticas.tareas_completadas}
              </Text>
              <Text style={[styles.statLabel, theme === 'light' ? styles.lightText : styles.darkText]}>
                Tareas
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="star" size={isSmallPhone ? 20 : 24} color="#388E3C" />
              </View>
              <Text style={[styles.statNumber, theme === 'light' ? styles.lightText : styles.darkText]}>
                {estadisticas.puntaje_total}
              </Text>
              <Text style={[styles.statLabel, theme === 'light' ? styles.lightText : styles.darkText]}>
                Puntos
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="layers" size={isSmallPhone ? 20 : 24} color="#7B1FA2" />
              </View>
              <Text style={[styles.statNumber, theme === 'light' ? styles.lightText : styles.darkText]}>
                {estadisticas.bloques_completados.length}
              </Text>
              <Text style={[styles.statLabel, theme === 'light' ? styles.lightText : styles.darkText]}>
                Bloques
              </Text>
            </View>
          </View>
        )}

        {/* Logros */}
        <View style={styles.achievementsList}>
          {logros.length === 0 ? (
            <View style={[styles.emptyState, theme === 'light' ? styles.lightCard : styles.darkCard]}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={[styles.emptyTitle, theme === 'light' ? styles.lightText : styles.darkText]}>
                ¡Comienza tu aventura!
              </Text>
              <Text style={[styles.emptyDescription, theme === 'light' ? styles.lightText : styles.darkText]}>
                Completa tareas para ganar puntos y desbloquear premios especiales
              </Text>
              <Text style={[styles.emptyHint, theme === 'light' ? styles.lightText : styles.darkText]}>
                ⬇️ Desliza hacia abajo para actualizar
              </Text>
            </View>
          ) : (
            logros.map((achievement: Logro, index: number) => (
              <View
                key={achievement._id || `logro-${index}`}
                style={getCardStyle(achievement)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={[
                        styles.achievementIcon,
                        achievement.desbloqueado ? styles.unlockedIcon : styles.lockedIcon
                      ]}>
                        {achievement.icon}
                      </Text>
                      <View style={styles.textContent}>
                        <Text style={[styles.achievementTitle, theme === 'light' ? styles.lightText : styles.darkText]}>
                          {achievement.logro}
                        </Text>
                        <Text style={[styles.achievementDescription, theme === 'light' ? styles.lightText : styles.darkText]}>
                          {achievement.descripcion}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[
                    styles.iconContainer,
                    achievement.desbloqueado ? styles.unlockedIconContainer : styles.lockedIconContainer
                  ]}>
                    {achievement.desbloqueado ? (
                      <Ionicons name="checkmark-circle" size={isSmallPhone ? 28 : 32} color="#4CAF50" />
                    ) : (
                      <Ionicons name="lock-closed" size={isSmallPhone ? 28 : 32} color="#90A4AE" />
                    )}
                  </View>
                </View>

                {/* Progreso o estado desbloqueado */}
                {renderProgress(achievement)}

                {/* Puntos del logro */}
                <View style={styles.pointsContainer}>
                  <Ionicons name="diamond" size={isSmallPhone ? 14 : 16} color="#4FC3F7" />
                  <Text style={[styles.pointsText, theme === 'light' ? styles.lightText : styles.darkText]}>
                    Vale: {achievement.meta * 10} puntos
                  </Text>
                </View>

                {/* Fecha de desbloqueo */}
                {achievement.desbloqueado && achievement.fecha_desbloqueo && (
                  <Text style={[styles.unlockDate, theme === 'light' ? styles.lightText : styles.darkText]}>
                    🎊 Desbloqueado: {new Date(achievement.fecha_desbloqueo).toLocaleDateString('es-ES')}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Espacio extra para asegurar que se pueda scrollear completamente */}
        <View style={styles.bottomSpacer} />
      </Animated.View>
    </ScrollView>
  );
};

export default AchievementsScreen;