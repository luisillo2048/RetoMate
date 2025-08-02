import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useUserLevel } from "../context/UserLevelContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import styles from "../themes/MenuStyles";

const MenuScreen = () => {
  const navigation = useNavigation();
  const { block } = useUserLevel();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [isDrawerVisible, setDrawerVisible] = useState(false);

  //Aqu mis Actividades con nombres de pantalla correctos (sin "/src/screens/")
  const beginnerActivities = [
    {
      icon: FontAwesome5,
      iconName: "tasks",
      title: "Tareas Diarias",
      description: "Aprende a contar y reconocer números",
      screenName: "Tasks", 
    },
    {
      icon: Ionicons,
      iconName: "game-controller",
      title: "Juegos Educativos",
      description: "Diviértete con juegos de números",
      screenName: "Games",
    },
    {
      icon: MaterialCommunityIcons,
      iconName: "trophy",
      title: "Logros",
      description: "Mira tus medallas y progreso",
      screenName: "Achievements",
    },
  ];

  const intermediateActivities = [
    {
      icon: FontAwesome5,
      iconName: "tasks",
      title: "Tareas Diarias",
      description: "Practica sumas con números del 1 al 10",
      screenName: "Tasks",
    },
    {
      icon: Ionicons,
      iconName: "game-controller",
      title: "Juegos Educativos",
      description: "Juegos divertidos para practicar sumas",
      screenName: "Games",
    },
    {
      icon: MaterialCommunityIcons,
      iconName: "trophy",
      title: "Logros",
      description: "Mira tus medallas y progreso",
      screenName: "Achievements",
    },
  ];

  const advancedActivities = [
    {
      icon: FontAwesome5,
      iconName: "tasks",
      title: "Tareas Diarias",
      description: "Practica operaciones más complejas",
      screenName: "Tasks",
    },
    {
      icon: Ionicons,
      iconName: "game-controller",
      title: "Juegos Educativos",
      description: "Desafíos matemáticos divertidos",
      screenName: "Games",
    },
    {
      icon: MaterialCommunityIcons,
      iconName: "trophy",
      title: "Logros",
      description: "Mira tus medallas y progreso",
      screenName: "Achievements",
    },
  ];

  const menuItems =
    block === "1" ? beginnerActivities : block === "2" ? intermediateActivities : advancedActivities;

  return (
     <LinearGradient
          colors={['#6DD5FA', '#FF6B6B']}
          style={styles.container}
        >
    <View style={{ flex: 1 }}>
      {/* Drawer Modal (se mantiene IGUAL) */}
      <Modal visible={isDrawerVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 250,
              backgroundColor: theme === "light" ? "#fff" : "#1c1c1c",
              padding: 20,
              justifyContent: "center",
            }}
          >
            {/* Aqui mi Botón para cambiar tema */}
            <TouchableOpacity
              onPress={() => {
                toggleTheme();
              }}
              style={{
                paddingVertical: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name={theme === "light" ? "moon" : "sun"}
                size={20}
                color={theme === "light" ? "#000" : "#fff"}
              />
              <Text
                style={{
                  color: theme === "light" ? "#000" : "#fff",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
              </Text>
            </TouchableOpacity>

            {/* Aqui mi Botón para cerrar sesión */}
            <TouchableOpacity
              onPress={async () => {
                await logout();
                setDrawerVisible(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }}
              style={{
                paddingVertical: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name="log-out"
                size={20}
                color={theme === "light" ? "#000" : "#fff"}
              />
              <Text
                style={{
                  color: theme === "light" ? "#000" : "#fff",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setDrawerVisible(false)}
          />
        </View>
      </Modal>

      <ScrollView
        style={[
          styles.container,
          theme === "light" ? styles.lightContainer : styles.darkContainer,
        ]}
      >
        {/* Header con un saludo al estudiante tremendo flow  */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            style={{ marginRight: 15 }}
          >
            <Feather
              name="menu"
              size={24}
              color={theme === "light" ? "#000" : "#fff"}
            />
          </TouchableOpacity>

          <View>
            <Text
              style={[
                styles.title,
                theme === "light" ? styles.lightText : styles.darkText,
              ]}
            >
              ¡Hola, Estudiante!
            </Text>
            <Text
              style={[
                styles.subtitle,
                theme === "light" ? styles.lightText : styles.darkText,
              ]}
            >
            </Text>
          </View>
        </View>

        <View style={styles.activitiesContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screenName)} // Corregido aquí
              style={[
                styles.activityCard,
                theme === "light" ? styles.lightCard : styles.darkCard,
              ]}
            >
              <View style={styles.iconContainer}>
                <item.icon
                  name={item.iconName}
                  size={24}
                  color={theme === "light" ? "#3182ce" : "#BB86F2"}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.activityTitle,
                    theme === "light" ? styles.lightText : styles.darkText,
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.activityDescription,
                    theme === "light" ? styles.lightText : styles.darkText,
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
    </LinearGradient>
  );
};

export default MenuScreen;