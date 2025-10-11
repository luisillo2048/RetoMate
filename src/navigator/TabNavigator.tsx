import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Animated, Easing, Dimensions, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MenuScreen from "../screens/MenuScreen";
import GamesScreen from "../screens/GamesScreen";
import TasksScreen from "../screens/TasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

// Definir interfaz para las props del componente
interface MobileTabIconProps {
  focused: boolean;
  emoji: string;
  iconName: string;
  iconType: React.ComponentType<any>;
  label: string;
}

// Componente con gradiente
const MobileTabIcon = ({ focused, emoji, iconName, iconType, label }: MobileTabIconProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const bounceAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.25,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: -2,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [focused]);

  const IconComponent = iconType;

  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: screenWidth / 5 - (isSmallScreen ? 8 : 12),
      height: isSmallScreen ? 50 : 60,
      paddingVertical: 4,
    }}>
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim }
          ],
        }}
      >
        {focused ? (
          <LinearGradient
            colors={['#FF8C42', '#FFD166']}
            style={{
              padding: isSmallScreen ? 8 : 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {emoji ? (
              <Text style={{ 
                fontSize: isSmallScreen ? 18 : 20,
                includeFontPadding: false 
              }}>
                {emoji}
              </Text>
            ) : (
              <IconComponent 
                name={iconName} 
                size={isSmallScreen ? 18 : 20} 
                color="#FFFFFF" 
              />
            )}
          </LinearGradient>
        ) : (
          <View style={{
            padding: isSmallScreen ? 8 : 10,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {emoji ? (
              <Text style={{ 
                fontSize: isSmallScreen ? 18 : 20,
                includeFontPadding: false,
                opacity: 0.8
              }}>
                {emoji}
              </Text>
            ) : (
              <IconComponent 
                name={iconName} 
                size={isSmallScreen ? 18 : 20} 
                color="rgba(255, 255, 255, 0.8)" 
              />
            )}
          </View>
        )}
      </Animated.View>
      
      {!isSmallScreen && (
        <Text
          style={{
            fontSize: 10,
            color: focused ? "#FFD166" : "rgba(255, 255, 255, 0.8)",
            fontWeight: focused ? '700' : '500',
            fontFamily: 'System',
            textAlign: 'center',
            includeFontPadding: false,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const TabNavigator = () => {
  const tabBarHeight = Platform.select({
    ios: screenHeight * (isSmallScreen ? 0.09 : 0.095),
    android: screenHeight * (isSmallScreen ? 0.10 : 0.105)
  });

  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: Platform.select({
            ios: isSmallScreen ? 10 : 14,
            android: isSmallScreen ? 12 : 16
          }),
          paddingTop: 10,
          // Bordes redondeados superiores más pronunciados
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          // Sin sombra en el contenedor principal
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          position: 'absolute',
          bottom: 0,
          left: 15,
          right: 15,
          // Fondo transparente para que se vea el gradiente
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#4A90E2', '#9B6BCC']}
            style={{
              flex: 1,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MobileTabIcon 
              focused={focused}
              emoji="🏠"
              iconName="home"
              iconType={Ionicons}
              label="Inicio"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Games" 
        component={GamesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MobileTabIcon 
              focused={focused}
              emoji="🎮"
              iconName="game-controller"
              iconType={Ionicons}
              label="Juegos"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MobileTabIcon 
              focused={focused}
              emoji="📚"
              iconName="checkmark-done"
              iconType={Ionicons}
              label="Tareas"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MobileTabIcon 
              focused={focused}
              emoji="🏆"
              iconName="trophy"
              iconType={Ionicons}
              label="Logros"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MobileTabIcon 
              focused={focused}
              emoji="😊"
              iconName="person"
              iconType={Ionicons}
              label="Perfil"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;