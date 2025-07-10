import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigator/AuthNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { UserLevelProvider } from "./src/context/UserLevelContext";
import { ThemeProvider } from "./src/context/ThemeContext"; 

export default function App() {
  return (
    <AuthProvider>
      <UserLevelProvider>
        <ThemeProvider> 
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </UserLevelProvider>
    </AuthProvider>
  );
}
