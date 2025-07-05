import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigator/AuthNavigator";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
