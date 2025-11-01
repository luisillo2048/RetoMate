import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";
import commonStyles from "../themes/Styles";

interface RegisterSettingsMenuProps {
  animationsPaused: boolean;
  soundPaused: boolean;
  onToggleAnimations: () => void;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
}

export const RegisterSettingsMenu: React.FC<RegisterSettingsMenuProps> = ({
  animationsPaused,
  soundPaused,
  onToggleAnimations,
  onToggleSound,
  onVolumeChange
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { colors } = useTheme();
  const [currentVolume, setCurrentVolume] = useState(1.0);

  const volumeLevels = [0, 0.3, 0.6, 1.0];

  const handleVolumeSelect = (volume: number) => {
    setCurrentVolume(volume);
    onVolumeChange(volume);
  };

  const handleToggleAnimations = () => {
    onToggleAnimations();
    // NO llamar a onToggleSound aquí - están separados
  };

  const handleToggleSound = () => {
    onToggleSound();
    // NO llamar a onToggleAnimaciones aquí - están separados
  };

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <TouchableOpacity
        style={commonStyles.settingsMenuButton}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="cog"
          size={28}
          color="#FFF"
        />
      </TouchableOpacity>

      {/* Menú desplegable */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={commonStyles.settingsOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={commonStyles.settingsMenuContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={commonStyles.settingsMenuContent}
            >
              {/* Encabezado */}
              <View style={commonStyles.settingsHeader}>
                <Text style={commonStyles.settingsTitle}>🎮 Configuración</Text>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Control de Animaciones - SEPARADO del sonido */}
              <TouchableOpacity
                style={commonStyles.settingsItem}
                onPress={handleToggleAnimations}
              >
                <View style={commonStyles.settingsItemLeft}>
                  <MaterialCommunityIcons
                    name={animationsPaused ? "play" : "pause"}
                    size={24}
                    color="#FFF"
                  />
                  <Text style={commonStyles.settingsItemText}>
                    {animationsPaused ? "▶️ Reanudar Animaciones" : "⏸️ Pausar Animaciones"}
                  </Text>
                </View>
                <View style={[
                  commonStyles.settingsIndicator,
                  { backgroundColor: animationsPaused ? '#FF6B6B' : '#4ECDC4' }
                ]}>
                  <Text style={commonStyles.settingsIndicatorText}>
                    {animationsPaused ? "OFF" : "ON"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Control de Sonido - SEPARADO de las animaciones */}
              <TouchableOpacity
                style={commonStyles.settingsItem}
                onPress={handleToggleSound}
              >
                <View style={commonStyles.settingsItemLeft}>
                  <MaterialCommunityIcons
                    name={soundPaused ? "volume-off" : "volume-high"}
                    size={24}
                    color="#FFF"
                  />
                  <Text style={commonStyles.settingsItemText}>
                    {soundPaused ? "🔇 Sonido Apagado" : "🔊 Sonido Encendido"}
                  </Text>
                </View>
                <View style={[
                  commonStyles.settingsIndicator,
                  { backgroundColor: soundPaused ? '#FF6B6B' : '#4ECDC4' }
                ]}>
                  <Text style={commonStyles.settingsIndicatorText}>
                    {soundPaused ? "OFF" : "ON"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Control de Volumen */}
              <View style={commonStyles.volumeContainer}>
                <Text style={commonStyles.volumeTitle}>🎵 Nivel de Volumen</Text>
                <View style={commonStyles.volumeLevels}>
                  {volumeLevels.map((volume, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        commonStyles.volumeButton,
                        currentVolume === volume && commonStyles.volumeButtonSelected
                      ]}
                      onPress={() => handleVolumeSelect(volume)}
                    >
                      <Text style={commonStyles.volumeButtonText}>
                        {volume === 0 ? "🔇" : 
                         volume === 0.3 ? "🔈" : 
                         volume === 0.6 ? "🔉" : "🔊"}
                      </Text>
                      <Text style={commonStyles.volumeLabel}>
                        {volume === 0 ? "Sin" : 
                         volume === 0.3 ? "Bajo" : 
                         volume === 0.6 ? "Medio" : "Alto"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Mensaje divertido para niños */}
              <View style={commonStyles.settingsFooter}>
                <Text style={commonStyles.settingsFooterText}>
                  ¡Ajusta todo a tu gusto! 🎉
                </Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};