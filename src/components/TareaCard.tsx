import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { Tarea } from '../types';
import { getDifficultyColor } from '../utils/storage';
import styles from '../themes/TasksStyles';

interface TareaCardProps {
  tarea: Tarea;
  index: number;
  completada: boolean;
  desbloqueado: boolean;
  onSelectTarea: (tarea: Tarea) => void;
  dificultadNormalizada: string;
}

const TareaCard = ({
  tarea,
  index,
  completada,
  desbloqueado,
  onSelectTarea,
  dificultadNormalizada
}: TareaCardProps) => {
  const { colors } = useTheme();

  return (
    <Animatable.View
      animation="fadeInRight"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity
        style={[styles.tareaContainer, completada && styles.tareaCompletada, {
          backgroundColor: completada ? '#E8F5E8' : '#FFF',
          borderLeftWidth: 4,
          borderLeftColor: getDifficultyColor(dificultadNormalizada),
        }]}
        onPress={() => {
          if (!completada && desbloqueado) {
            onSelectTarea(tarea);
          }
        }}
        activeOpacity={completada ? 1 : 0.7}
        disabled={completada || !desbloqueado}
      >
        <View style={styles.tareaHeader}>
          <Text style={styles.tareaPregunta}>{tarea.pregunta}</Text>
          {completada ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="play-circle" size={24} color={colors.primary} />
          )}
        </View>
        <View style={styles.tareaFooter}>
          <View style={styles.puntajeContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.tareaPuntaje}>Puntaje: {tarea.puntaje}</Text>
          </View>
          {tarea.dificultad && (
            <View style={[styles.tareaDificultad, { 
              backgroundColor: getDifficultyColor(dificultadNormalizada)
            }]}>
              <Text style={styles.dificultadText}>
                {dificultadNormalizada}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default TareaCard;