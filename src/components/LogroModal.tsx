import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Ionicons name="trophy" size={50} color="#FFD700" />
            <Text style={styles.modalTitle}>¡Logro Desbloqueado! 🎉</Text>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              {logro.icon || '🏆'} {logro.logro}
            </Text>
            <Text style={styles.modalDescription}>
              {logro.descripcion}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.modalButton, {
              backgroundColor: colors.primary,
            }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>¡Genial!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogroModal;