import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { Tarea } from '../types/tarea';
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

  // Función para mostrar el nombre completo de la dificultad
  const getNombreDificultad = (dificultad: string) => {
    switch(dificultad) {
      case 'facil': return 'Fácil 🟢';
      case 'media': return 'Media 🟡';
      case 'dificil': return 'Difícil 🔴';
      default: return dificultad;
    }
  };

  return (
    <Animatable.View
      animation="fadeInRight"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity
        style={[styles.tareaContainer, completada && styles.tareaCompletada, {
          backgroundColor: colors.card,
          borderLeftWidth: 6,
          borderLeftColor: getDifficultyColor(dificultadNormalizada),
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
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
          <Text style={[styles.tareaPregunta, { color: colors.text }]}>
            {tarea.pregunta}
          </Text>
          {completada ? (
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          ) : (
            <Ionicons 
              name="play-circle" 
              size={28} 
              color={desbloqueado ? colors.primary : '#CCCCCC'} 
            />
          )}
        </View>
        
        <View style={styles.tareaFooter}>
          <View style={styles.puntajeContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={[styles.tareaPuntaje, { color: colors.text }]}>
              Puntaje: {tarea.puntaje} ⭐
            </Text>
          </View>
          
          {tarea.dificultad && (
            <View style={[styles.tareaDificultad, { 
              backgroundColor: getDifficultyColor(dificultadNormalizada)
            }]}>
              <Text style={styles.dificultadText}>
                {getNombreDificultad(dificultadNormalizada)}
              </Text>
            </View>
          )}
        </View>

        {/* Estado de la tarea */}
        <View style={styles.tareaEstado}>
          {completada ? (
            <Text style={[styles.estadoText, { color: '#4CAF50' }]}>
              ✅ Completada
            </Text>
          ) : !desbloqueado ? (
            <Text style={[styles.estadoText, { color: '#FF6B6B' }]}>
              🔒 Bloqueada
            </Text>
          ) : (
            <Text style={[styles.estadoText, { color: colors.primary }]}>
              🎯 ¡Toca para jugar!
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default TareaCard;