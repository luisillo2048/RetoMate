import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import styles from "../themes//Styles";

interface PrivacyModalProps {
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  visible,
  onAccept,
  onReject
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.privacyModalOverlay}>
        <View style={[styles.privacyModalContent, { backgroundColor: colors.card }]}>
          
          {/* Header */}
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
            <Text style={[styles.privacyModalTitle, { color: colors.text }]}>
              🎮 ¡Bienvenido a RetoMate!
            </Text>
            <Text style={[styles.privacySubtitle, { color: colors.text }]}>
              Aviso importante antes de comenzar
            </Text>
          </View>

          {/* Contenido */}
          <ScrollView 
            style={styles.privacyScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.privacyContent}>
              
              {/* Información principal */}
              <View style={styles.infoSection}>
                <Text style={[styles.privacyModalText, { color: colors.text }]}>
                  <Text style={[styles.highlight, { color: colors.primary }]}>RetoMate</Text> es una aplicación educativa diseñada especialmente para niños de primer grado, con animaciones divertidas, música emocionante y un asistente virtual que ayuda a resolver ejercicios matemáticos de manera divertida.
                </Text>
              </View>

              {/* Puntos importantes */}
              <View style={styles.pointsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  📋 Para tu seguridad:
                </Text>
                
                <View style={styles.pointItem}>
                  <Ionicons name="eye" size={20} color="#FF6B6B" />
                  <Text style={[styles.pointText, { color: colors.text }]}>
                    <Text style={styles.bold}>Supervisión:</Text> Usa la app con un adulto cerca
                  </Text>
                </View>

                <View style={styles.pointItem}>
                  <Ionicons name="heart" size={20} color="#FF6B6B" />
                  <Text style={[styles.pointText, { color: colors.text }]}>
                    <Text style={styles.bold}>Salud:</Text> Si sientes mareos o malestar, para y avisa a un adulto
                  </Text>
                </View>

                <View style={styles.pointItem}>
                  <Ionicons name="timer" size={20} color="#4ECDC4" />
                  <Text style={[styles.pointText, { color: colors.text }]}>
                    <Text style={styles.bold}>Descansos:</Text> Toma pausas cada 20-30 minutos
                  </Text>
                </View>

                <View style={styles.pointItem}>
                  <Ionicons name="lock-closed" size={20} color="#45B7D1" />
                  <Text style={[styles.pointText, { color: colors.text }]}>
                    <Text style={styles.bold}>Privacidad:</Text> Tus datos son solo para aprender y jugar
                  </Text>
                </View>

                <View style={styles.pointItem}>
                  <Ionicons name="hardware-chip" size={20} color="#96CEB4" />
                  <Text style={[styles.pointText, { color: colors.text }]}>
                    <Text style={styles.bold}>Asistente IA:</Text> Te ayudará cuando lo necesites 🤖
                  </Text>
                </View>
              </View>

              {/* Mensaje final */}
              <View style={styles.finalMessage}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={[styles.finalText, { color: colors.text }]}>
                  Al continuar, confirmas que has leído este aviso y das tu consentimiento para usar RetoMate de manera educativa y segura.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.privacyModalButtons}>
            <TouchableOpacity
              style={styles.privacyRejectButton}
              onPress={onReject}
            >
              <Ionicons name="close-circle" size={20} color="#FFF" />
              <Text style={styles.privacyButtonText}>Rechazar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.privacyAcceptButton, { backgroundColor: colors.primary }]}
              onPress={onAccept}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.privacyButtonText}>¡Aceptar y Jugar!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};