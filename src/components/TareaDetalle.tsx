import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { Tarea } from '../types';
import { getImageUrl, getDifficultyColor, normalizarDificultad } from '../utils/storage';
import { leerPregunta, leerOpciones, leerTexto } from '../utils/speech';
import styles from '../themes/TasksStyles';

interface TareaDetalleProps {
  tareaActual: Tarea;
  selected: string | null;
  respondido: boolean;
  correcta: boolean;
  loading: boolean;
  mostrarRespuesta: boolean;
  bloquearOpciones: boolean;
  erroresConsecutivos: number;
  onVerificarRespuesta: (opcion: string) => void;
  onVolver: () => void;
  onContinuar: () => void;
}

const TareaDetalle = ({
  tareaActual,
  selected,
  respondido,
  correcta,
  loading,
  mostrarRespuesta,
  bloquearOpciones,
  erroresConsecutivos,
  onVerificarRespuesta,
  onVolver,
  onContinuar
}: TareaDetalleProps) => {
  const { colors } = useTheme();
  const imageUrl = getImageUrl(tareaActual.imagen || '');
  const dificultadNormalizada = normalizarDificultad(tareaActual.dificultad || 'facil');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {erroresConsecutivos > 0 && (
          <View style={styles.contadorOportunidades}>
            <Text style={styles.contadorTexto}>
              Oportunidades restantes: {3 - erroresConsecutivos} ⭐
            </Text>
          </View>
        )}

        <View style={styles.tareaHeaderContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onVolver}
          >
            <Ionicons name="arrow-back" size={24} color="#4B3F2F" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
          
          <View style={styles.tareaInfo}>
            <View style={styles.bloqueBadge}>
              <Text style={styles.bloqueText}>Bloque {tareaActual.bloque}</Text>
            </View>
            {tareaActual.dificultad && (
              <View style={[styles.difficultyBadge, { 
                backgroundColor: getDifficultyColor(dificultadNormalizada)
              }]}>
                <Text style={styles.difficultyText}>
                  {dificultadNormalizada}
                </Text>
              </View>
            )}
          </View>
        </View>

        {imageUrl && (
          <View>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.imagen}
              resizeMode="contain"
            />
          </View>
        )}
        
        <View style={styles.questionHeader}>
          <Text style={styles.title}>{tareaActual.pregunta}</Text>
          <View style={styles.audioButtonsContainer}>
            <TouchableOpacity 
              onPress={() => leerPregunta(tareaActual)}
              style={styles.speakButton}
            >
              <Ionicons name="volume-medium" size={24} color={colors.primary} />
              <Text style={styles.audioButtonText}>Pregunta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => leerOpciones(tareaActual)}
              style={styles.speakButton}
            >
              <Ionicons name="list" size={24} color={colors.secondary} />
              <Text style={styles.audioButtonText}>Opciones</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {tareaActual.opciones?.map((opcion, index) => {
            const isSelected = selected === opcion;
            const isCorrect = opcion === tareaActual.respuestaCorrecta;

            let backgroundColor = '#F0F0F0';
            if (respondido && mostrarRespuesta) {
              if (isSelected && isCorrect) backgroundColor = '#4CAF50';
              else if (isSelected && !isCorrect) backgroundColor = '#F44336';
              else if (isCorrect) backgroundColor = '#C8E6C9';
            } else if (isSelected) {
              backgroundColor = colors.primary;
            }

            return (
              <View key={index}>
                <TouchableOpacity
                  style={[styles.optionButton, { 
                    backgroundColor,
                  }]}
                  disabled={respondido || loading || bloquearOpciones}
                  onPress={() => onVerificarRespuesta(opcion)}
                  onLongPress={() => leerTexto(opcion)}
                >
                  <Text style={[
                    styles.optionText,
                    (respondido && mostrarRespuesta && isCorrect) && styles.correctOptionText,
                    (respondido && mostrarRespuesta && isSelected && !isCorrect) && styles.incorrectOptionText,
                    isSelected && !respondido && styles.selectedOptionText
                  ]}>
                    {opcion}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => leerTexto(opcion)}
                    style={styles.audioOptionButton}
                  >
                    <Ionicons name="volume-medium" size={20} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Pensando...</Text>
          </View>
        )}

        {respondido && mostrarRespuesta && (
          <View style={styles.feedbackContainer}>
            <Ionicons
              name={correcta ? 'checkmark-circle' : 'close-circle'}
              size={64}
              color={correcta ? '#4CAF50' : '#F44336'}
            />
            <Text style={styles.feedbackText}>
              {correcta ? '¡Respuesta Correcta! 🎉' : 'Respuesta Incorrecta 😕'}
            </Text>
            <Text style={styles.correctAnswerText}>
              La respuesta correcta es: {tareaActual.respuestaCorrecta}
            </Text>
            
            <TouchableOpacity
              style={[styles.nextButton, loading && styles.nextButtonDisabled, {
                backgroundColor: correcta ? '#4CAF50' : colors.primary,
              }]}
              onPress={onContinuar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.nextButtonText}>
                  {correcta ? 'Continuar 🚀' : 'Intentar Otra 🔄'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TareaDetalle;