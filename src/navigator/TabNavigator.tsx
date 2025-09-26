import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MenuScreen from "../screens/MenuScreen";
import GamesScreen from "../screens/GamesScreen";
import TasksScreen from "../screens/TasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#BB86FC",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          switch (route.name) {
            case "Menu":
              iconName = "home-outline";
              break;
            case "Games":
              iconName = "game-controller-outline";
              break;
            case "Tasks":
              iconName = "checkmark-done-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            case "Achievements":
              iconName = "trophy-outline";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
