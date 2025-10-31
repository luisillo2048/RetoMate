import React from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import styles from "../themes/MenuStyles";

interface DrawerMenuProps {
  isVisible: boolean;
  drawerSlideAnim: Animated.Value;
  theme: string;
  isLoggingOut: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isVisible,
  drawerSlideAnim,
  theme,
  isLoggingOut,
  onClose,
  onToggleTheme,
  onLogout
}) => {
  const { colors } = useTheme();

  return (
    <Modal 
      visible={isVisible} 
      animationType="none" 
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: drawerSlideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.drawerGradient}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Configuración</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.drawerContent}>
              {/* Opción de Tema */}
              <TouchableOpacity
                onPress={onToggleTheme}
                style={styles.drawerItem}
                disabled={isLoggingOut}
              >
                <View style={styles.drawerIconContainer}>
                  <Feather
                    name={theme === "light" ? "moon" : "sun"}
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View style={styles.drawerTextContainer}>
                  <Text style={styles.drawerText}>
                    {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
                  </Text>
                  <Text style={styles.drawerSubtext}>
                    {theme === "light" ? "Activar modo noche" : "Activar modo día"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Separador */}
              <View style={styles.drawerSeparator} />

              {/* Opción de Cerrar Sesión */}
              <TouchableOpacity
                onPress={onLogout}
                style={styles.drawerItem}
                disabled={isLoggingOut}
              >
                <View style={styles.drawerIconContainer}>
                  <Feather 
                    name="log-out" 
                    size={24} 
                    color={isLoggingOut ? "rgba(255,255,255,0.5)" : "#FFF"} 
                  />
                </View>
                <View style={styles.drawerTextContainer}>
                  <Text style={[
                    styles.drawerText,
                    isLoggingOut && { color: "rgba(255,255,255,0.5)" }
                  ]}>
                    {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
                  </Text>
                  <Text style={[
                    styles.drawerSubtext,
                    isLoggingOut && { color: "rgba(255,255,255,0.5)" }
                  ]}>
                    Salir de la aplicación
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.footerText}>Versión 1.0</Text>
              <Text style={styles.footerText}>¡Aprende Divirtiéndote! 🎉</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};