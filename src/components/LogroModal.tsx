import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import styles from '../themes/TasksStyles';

interface LogroModalProps {
  visible: boolean;
  logro: any;
  onClose: () => void;
}

const LogroModal = ({
  visible,
  logro,
  onClose
}: LogroModalProps) => {
  const { colors } = useTheme();

  if (!logro) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View 
          style={[styles.modalContainer, { backgroundColor: colors.card }]}
          animation="bounceIn"
          duration={800}
        >
          {/* Confeti animado */}
          <View style={styles.confettiContainer}>
            <Animatable.Text 
              animation="bounce"
              iterationCount="infinite"
              style={styles.confetti}>🎉</Animatable.Text>
            <Animatable.Text 
              animation="bounce"
              iterationCount="infinite"
              delay={200}
              style={styles.confetti}>✨</Animatable.Text>
            <Animatable.Text 
              animation="bounce"
              iterationCount="infinite"
              delay={400}
              style={styles.confetti}>⭐</Animatable.Text>
          </View>

          <View style={styles.modalHeader}>
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
            >
              <Ionicons name="trophy" size={60} color="#FFD700" />
            </Animatable.View>
            <Animatable.Text 
              animation="fadeInUp"
              duration={600}
              style={[styles.modalTitle, { color: colors.text }]}
            >
              ¡Logro Desbloqueado!
            </Animatable.Text>
          </View>
          
          <View style={styles.modalBody}>
            <Animatable.View
              animation="zoomIn"
              duration={600}
              delay={300}
              style={styles.logroContent}
            >
              <Text style={[styles.logroIcon, { fontSize: 40 }]}>
                {logro.icon || '🏆'}
              </Text>
              <Text style={[styles.logroName, { color: colors.text }]}>
                {logro.logro}
              </Text>
              <Text style={[styles.logroDescription, { color: colors.text }]}>
                {logro.descripcion}
              </Text>
            </Animatable.View>

            {/* Barra de progreso visual */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <Animatable.View 
                  style={[styles.progressFill, { backgroundColor: colors.primary }]}
                  animation="fadeInRight"
                  duration={1000}
                  delay={500}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.text }]}>
                ¡Sigue así! 🚀
              </Text>
            </View>
          </View>
          
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={700}
          >
            <TouchableOpacity
              style={[styles.celebrateButton, {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              }]}
              onPress={onClose}
            >
              <Ionicons name="sparkles" size={24} color="#FFF" />
              <Text style={styles.celebrateButtonText}>¡Continuar Aventura!</Text>
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

export default LogroModal;