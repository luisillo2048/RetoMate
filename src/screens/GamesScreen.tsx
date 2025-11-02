import React, { useState, useEffect } from 'react';
import { View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Linking, 
  Animated, 
  Easing, 
  Alert,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import styles from '../themes/GameStyles';
import { globalStyles } from "../themes/globalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Game {
  id: string;
  title: string;
  description: string;
  image: any;
  link: string;
  pointsRequired: number;
  pointsReward: number;
  difficulty: string;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MathGamesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme, colors } = useTheme(); // Usar el contexto de tema
  const [activeCategory, setActiveCategory] = useState('sumas');
  const [userPoints, setUserPoints] = useState(0);
  const [unlockedGames, setUnlockedGames] = useState<string[]>([]);
  const [bounceAnim] = useState(new Animated.Value(1));
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // CLAVES PARA GUARDAR DATOS
  const PURCHASED_GAMES_KEY = `purchased_games_${user?.id || 'guest'}`;

  // CARGAR PUNTOS Y JUEGOS COMPRADOS
  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    await loadUserPoints();
    await loadPurchasedGames();
  };

  // CARGAR PUNTOS REALES DEL USUARIO - CORREGIDO
  const loadUserPoints = async () => {
    try {
      setLoading(true);
      
      // Si no hay usuario, usar puntos locales
      if (!user?.id) {
        const localPoints = await getLocalPoints();
        setUserPoints(localPoints);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        const localPoints = await getLocalPoints();
        setUserPoints(localPoints);
        return;
      }
      
      const response = await axios.get(
        `${apiUrl}/progreso/progreso/${user.id}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      const progresoData = response.data;
      
      // Calcular puntos totales desde API
      const totalPuntosFromAPI = progresoData.reduce((sum: number, progreso: any) => {
        return sum + (progreso.puntaje || 0);
      }, 0);
      
      // Cargar puntos gastados
      const spent = await getSpentPoints();
      
      // Calcular puntos actuales
      const currentPoints = Math.max(0, totalPuntosFromAPI - spent);
      setUserPoints(currentPoints);
      
      // Actualizar puntos locales
      await saveLocalPoints(currentPoints);
      
    } catch (error: any) {
      console.log('Usando puntos locales (API no disponible):', error.message);
      // En caso de error, usar puntos locales
      const localPoints = await getLocalPoints();
      setUserPoints(localPoints);
    } finally {
      setLoading(false);
    }
  };

  // OBTENER PUNTOS GASTADOS
  const getSpentPoints = async (): Promise<number> => {
    try {
      if (!user?.id) return 0;
      
      const SPENT_POINTS_KEY = `spent_points_${user.id}`;
      const savedSpentPoints = await AsyncStorage.getItem(SPENT_POINTS_KEY);
      return savedSpentPoints ? parseInt(savedSpentPoints) : 0;
    } catch (error) {
      return 0;
    }
  };

  // OBTENER PUNTOS LOCALES (para cuando no hay API)
  const getLocalPoints = async (): Promise<number> => {
    try {
      const LOCAL_POINTS_KEY = `local_points_${user?.id || 'guest'}`;
      const localPoints = await AsyncStorage.getItem(LOCAL_POINTS_KEY);
      return localPoints ? parseInt(localPoints) : 0;
    } catch (error) {
      return 0;
    }
  };

  // GUARDAR PUNTOS LOCALES
  const saveLocalPoints = async (points: number) => {
    try {
      const LOCAL_POINTS_KEY = `local_points_${user?.id || 'guest'}`;
      await AsyncStorage.setItem(LOCAL_POINTS_KEY, points.toString());
    } catch (error) {
      console.log('Error guardando puntos locales:', error);
    }
  };

  // CARGAR JUEGOS COMPRADOS
  const loadPurchasedGames = async () => {
    try {
      const purchasedGamesJson = await AsyncStorage.getItem(PURCHASED_GAMES_KEY);
      if (purchasedGamesJson) {
        const purchasedGames = JSON.parse(purchasedGamesJson);
        setUnlockedGames(purchasedGames);
      } else {
        setUnlockedGames([]);
      }
    } catch (error) {
      console.log('Error cargando juegos comprados:', error);
      setUnlockedGames([]);
    }
  };

  // GUARDAR PUNTOS GASTADOS
  const saveSpentPoints = async (points: number) => {
    try {
      if (!user?.id) return;
      
      const SPENT_POINTS_KEY = `spent_points_${user.id}`;
      await AsyncStorage.setItem(SPENT_POINTS_KEY, points.toString());
    } catch (error) {
      console.log('Error guardando puntos gastados:', error);
    }
  };

  // GUARDAR JUEGOS COMPRADOS
  const savePurchasedGames = async (games: string[]) => {
    try {
      await AsyncStorage.setItem(PURCHASED_GAMES_KEY, JSON.stringify(games));
    } catch (error) {
      console.log('Error guardando juegos:', error);
    }
  };

  // COMPRAR JUEGO
  const purchaseGame = async (game: Game) => {
    try {
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para comprar juegos');
        return;
      }

      // Cargar puntos gastados actuales
      const currentSpent = await getSpentPoints();
      
      // Calcular nuevos puntos gastados
      const newSpentPoints = currentSpent + game.pointsRequired;
      
      // Actualizar estados
      const newPoints = userPoints - game.pointsRequired;
      setUserPoints(newPoints);

      // Guardar puntos locales también
      await saveLocalPoints(newPoints);

      // Agregar a juegos comprados
      const newUnlockedGames = [...unlockedGames, game.id];
      setUnlockedGames(newUnlockedGames);

      // Guardar en AsyncStorage
      await saveSpentPoints(newSpentPoints);
      await savePurchasedGames(newUnlockedGames);

      // Mostrar confirmación
      Alert.alert(
        '¡Compra Exitosa! 🎉',
        `Has comprado "${game.title}" por ${game.pointsRequired} puntos\n\nPuntos restantes: ${newPoints} 💎`,
        [
          { 
            text: 'Jugar Ahora 🚀', 
            onPress: () => openLink(game.link)
          },
          { 
            text: 'Seguir Navegando', 
            style: 'cancel' 
          }
        ]
      );

    } catch (error) {
      console.log('Error en la compra:', error);
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  // PULL TO REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // Animación de puntos
  useEffect(() => {
    const bounce = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(bounce).start();
  }, []);

  // JUEGOS CON PRECIOS EN PUNTOS - Actualizados con colores del tema
  const categories: Category[] = [
    { 
      id: 'sumas', 
      name: 'Sumas', 
      icon: 'plus-circle',
      color: colors.primary
    },
    { 
      id: 'restas', 
      name: 'Restas', 
      icon: 'minus-circle',
      color: colors.secondary
    },
    { 
      id: 'multiplicar', 
      name: 'Multiplicar', 
      icon: 'close-circle',
      color: colors.accent
    },
    { 
      id: 'aventura', 
      name: 'Aventura', 
      icon: 'rocket-launch',
      color: colors.primary
    }
  ];

  const exercises: { [key: string]: Game[] } = {
    sumas: [
      { 
        id: 'suma_facil',
        title: 'Suma con Animalitos 🐰', 
        description: 'Aprende sumas con animales divertidos', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-sumas-dibujos/',
        pointsRequired: 0,
        pointsReward: 10,
        difficulty: 'Fácil'
      },
      { 
        id: 'carrera_sumas',
        title: 'Carrera de Sumas 🏎️', 
        description: '¡Corre contra el tiempo!', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-suma-rapida/',
        pointsRequired: 50,
        pointsReward: 15,
        difficulty: 'Medio'
      }
    ],
    restas: [
      { 
        id: 'resta_frutas',
        title: 'Restas con Frutas 🍎', 
        description: 'Quita frutas y aprende', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-restas-dibujos/',
        pointsRequired: 30,
        pointsReward: 12,
        difficulty: 'Fácil'
      },
      { 
        id: 'resta_aventura',
        title: 'Aventura de Restas 🏔️', 
        description: 'Escala montañas resolviendo restas', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-restas-lunar/',
        pointsRequired: 80,
        pointsReward: 20,
        difficulty: 'Difícil'
      }
    ],
    multiplicar: [
      { 
        id: 'tablas_bailar',
        title: 'Tablas que Bailan 💃', 
        description: 'Aprende las tablas con música', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-tablas-multiplicar/',
        pointsRequired: 100,
        pointsReward: 25,
        difficulty: 'Medio'
      }
    ],
    aventura: [
      { 
        id: 'mision_math',
        title: 'Misión Matemática 🚀', 
        description: 'Viaja al espacio resolviendo problemas', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-matematicas-aventura/',
        pointsRequired: 150,
        pointsReward: 50,
        difficulty: 'Difícil'
      },
      { 
        id: 'desafio_final',
        title: 'Desafío Final 🏆', 
        description: '¡Conviértete en maestro matemático!', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.cokitos.com/juego-matematicas-desafio/',
        pointsRequired: 200,
        pointsReward: 100,
        difficulty: 'Experto'
      }
    ]
  };

  const isGamePurchased = (gameId: string): boolean => {
    return unlockedGames.includes(gameId);
  };

  const canBuyGame = (pointsRequired: number): boolean => {
    return userPoints >= pointsRequired;
  };

  const getLockedMessage = (pointsRequired: number): string => {
    const pointsNeeded = pointsRequired - userPoints;
    return `Te faltan ${pointsNeeded} puntos`;
  };

  const openLink = (url: string): void => {
    Linking.openURL(url).catch(err => {
      console.log("Error al abrir el enlace:", err);
      Alert.alert('Error', 'No se pudo abrir el juego');
    });
  };

  const handleGamePress = (exercise: Game): void => {
    // Si no hay usuario, mostrar alerta
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para jugar');
      return;
    }

    // Si ya está comprado, solo jugar
    if (isGamePurchased(exercise.id)) {
      openLink(exercise.link);
      return;
    }

    // Si es gratis, jugar directamente
    if (exercise.pointsRequired === 0) {
      openLink(exercise.link);
      return;
    }

    // Si puede comprar, mostrar diálogo de compra
    if (canBuyGame(exercise.pointsRequired)) {
      Alert.alert(
        '¡Comprar Juego! 🎮',
        `¿Quieres comprar "${exercise.title}" por ${exercise.pointsRequired} puntos?\n\nTus puntos: ${userPoints} 💎`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: '¡Comprar! ✅', 
            style: 'default',
            onPress: () => purchaseGame(exercise)
          }
        ]
      );
    } else {
      Alert.alert(
        '¡Faltan Puntos! 🔒',
        `Necesitas ${exercise.pointsRequired} puntos para este juego.\n\nTienes: ${userPoints} puntos\nTe faltan: ${exercise.pointsRequired - userPoints} puntos`,
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  const renderPointsHeader = () => (
    <Animated.View 
      style={[
        styles.pointsHeader,
        { transform: [{ scale: bounceAnim }] }
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.pointsGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.pointsContent}>
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="coins" size={32} color="#FFF" />
            <View style={styles.sparkle}>
              <Text style={styles.sparkleText}>✨</Text>
            </View>
          </View>
          <View style={styles.pointsTextContainer}>
            <Text style={styles.pointsLabel}>MIS TESOROS</Text>
            <Text style={styles.pointsValue}>
              {loading ? 'Cargando...' : `${userPoints} PUNTOS MÁGICOS`}
            </Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-circle" size={36} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderGameCard = (game: Game, index: number) => {
    const isPurchased = isGamePurchased(game.id);
    const canBuy = canBuyGame(game.pointsRequired);
    const isFree = game.pointsRequired === 0;

    return (
      <TouchableOpacity 
        key={game.id}
        style={[
          styles.gameCard,
          (!canBuy && !isFree && !isPurchased) && styles.lockedGameCard
        ]}
        onPress={() => handleGamePress(game)}
        disabled={!user}
      >
        {/* BADGE DE COMPRADO */}
        {isPurchased && (
          <View style={styles.purchasedBadge}>
            <Text style={styles.purchasedBadgeText}>✅ COMPRADO</Text>
          </View>
        )}

        {/* BADGE GRATIS */}
        {isFree && !isPurchased && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>🎁 GRATIS</Text>
          </View>
        )}

        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.gameCardGradient}
        >
          <Image source={game.image} style={styles.gameImage} />
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
            
            <View style={styles.gameFooter}>
              <View style={[
                styles.difficultyTag,
                { backgroundColor: 
                  game.difficulty === 'Fácil' ? '#4CAF50' :
                  game.difficulty === 'Medio' ? '#FF9800' : '#F44336'
                }
              ]}>
                <Text style={styles.difficultyText}>{game.difficulty}</Text>
              </View>
              
              <View style={styles.pointsContainer}>
                {isFree ? (
                  <Text style={styles.freeText}>GRATIS 🎁</Text>
                ) : isPurchased ? (
                  <Text style={styles.purchasedText}>✅ TUYO</Text>
                ) : (
                  <>
                    <FontAwesome5 name="coins" size={18} color="#FFD700" />
                    <Text style={styles.pointsCostText}>{game.pointsRequired} pts</Text>
                  </>
                )}
              </View>
            </View>

            {/* BOTÓN QUE CAMBIA SEGÚN EL ESTADO */}
            <LinearGradient
              colors={
                !user ? ['#CCCCCC', '#999999'] :
                isPurchased ? [colors.accent, colors.primary] :
                isFree ? ['#FF9800', '#F57C00'] :
                canBuy ? [colors.primary, colors.secondary] : ['#757575', '#616161']
              }
              style={[
                styles.actionButton,
                !user && styles.disabledButton
              ]}
            >
              <Text style={styles.actionButtonText}>
                {!user ? 'INICIA SESIÓN 🔒' :
                isPurchased ? 'JUGAR AHORA 🚀' : 
                isFree ? 'JUGAR GRATIS 🎮' : 
                canBuy ? 'COMPRAR Y JUGAR ✅' : 'BLOQUEADO 🔒'}
              </Text>
              <Ionicons 
                name={isPurchased ? "play-circle" : "game-controller"} 
                size={22} 
                color="#FFF" 
              />
            </LinearGradient>

            {/* MENSAJE DE BLOQUEADO */}
            {!canBuy && !isFree && !isPurchased && user && (
              <View style={styles.lockedOverlay}>
                <Ionicons name="lock-closed" size={18} color="#FFF" />
                <Text style={styles.lockedText}>{getLockedMessage(game.pointsRequired)}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={colors.background}
      style={globalStyles.container}
    >
      {/* HEADER CON PUNTOS */}
      {user && renderPointsHeader()}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary, colors.secondary]}
            tintColor={colors.primary}
          />
        }
      >
        {!user ? (
          <View style={styles.noUserContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.noUserGradient}
            >
              <Text style={styles.noUserTitle}>🎮 ¡Bienvenido Amiguito! 🎮</Text>
              <Text style={styles.noUserText}>
                Inicia sesión para descubrir juegos mágicos de matemáticas
              </Text>
              <Text style={styles.noUserSubText}>
                ¡Gana puntos resolviendo problemas y desbloquea aventuras increíbles!
              </Text>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>🐰 🏎️ 🍎 🚀 🏆</Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <>
            {/* TÍTULO PRINCIPAL */}
            <View style={styles.mainTitleContainer}>
              <Text style={[styles.mainTitle, { color: colors.primary }]}>🎪 CIRCO MATEMÁGICO 🎪</Text>
              <Text style={[styles.subTitle, { color: colors.secondary }]}>Elige tu juego favorito</Text>
            </View>

            {/* CATEGORÍAS */}
            <View style={styles.categoriesSection}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>🎯 ELIGE TU AVENTURA</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScrollContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      activeCategory === category.id && styles.activeCategoryButton
                    ]}
                    onPress={() => setActiveCategory(category.id)}
                  >
                    <LinearGradient
                      colors={activeCategory === category.id ? 
                        [category.color, category.color] : 
                        [colors.primary, colors.secondary]
                      }
                      style={styles.categoryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialCommunityIcons 
                        name={category.icon} 
                        size={36} 
                        color="#FFF" 
                      />
                      <Text style={styles.categoryText}>{category.name}</Text>
                      {activeCategory === category.id && (
                        <View style={styles.activeIndicator}>
                          <Text style={styles.activeIndicatorText}>⭐</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* JUEGOS DE LA CATEGORÍA */}
            <View style={styles.gamesSection}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                🎮 JUEGOS DE {categories.find(c => c.id === activeCategory)?.name?.toUpperCase()}
              </Text>
              
              <View style={styles.gamesGrid}>
                {exercises[activeCategory]?.map(renderGameCard)}
              </View>
            </View>

            {/* FOOTER DECORATIVO */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.primary }]}>¡Sigue jugando y aprendiendo! 🌟</Text>
              <Text style={styles.footerEmoji}>🐰 🦊 🐻 🐯 🦁</Text>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};


export default MathGamesScreen;