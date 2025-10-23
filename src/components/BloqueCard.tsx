import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useTheme } from '../context/ThemeContext';
import { Tarea } from '../types/tarea';
import TareaCard from './TareaCard';
import styles from '../themes/TasksStyles';

interface BloqueCardProps {
  bloque: number;
  tareas: Tarea[];
  progreso: any[];
  desbloqueado: boolean;
  bloqueActivo: number | null;
  onToggleBloque: (bloque: number) => void;
  onIniciarTarea: (bloque: number) => void;
  onSelectTarea: (tarea: Tarea) => void;
  tareasRespondidasIds: Set<string>;
}

const BloqueCard = ({
  bloque,
  tareas,
  progreso,
  desbloqueado,
  bloqueActivo,
  onToggleBloque,
  onIniciarTarea,
  onSelectTarea,
  tareasRespondidasIds
}: BloqueCardProps) => {
  const { colors } = useTheme();

  const calcularProgresoBloque = () => {
    const completadas = tareas.filter((tarea) =>
      progreso.find((p) => p.id_tarea?._id === tarea._id)
    );
    return tareas.length > 0 ? completadas.length / tareas.length : 0;
  };

  const progresoBloque = calcularProgresoBloque();
  const completadas = tareas.filter((tarea) =>
    progreso.find((p) => p.id_tarea?._id === tarea._id)
  );

  return (
    <Animatable.View 
      style={styles.bloqueContainer}
      animation="fadeInUp"
      duration={800}
      delay={bloque * 100}
    >
      <TouchableOpacity 
        onPress={() => onToggleBloque(bloque)} 
        disabled={!desbloqueado}
        activeOpacity={0.7}
      >
        <View style={[styles.bloqueBoton, { 
          backgroundColor: desbloqueado ? colors.primary : '#ccc',
        }]}
        >
          <Text style={styles.bloqueTitulo}>
            {desbloqueado ? '🔓' : '🔒'} Bloque {bloque}
          </Text>
          <Ionicons 
            name={bloqueActivo === bloque ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#FFF" 
          />
        </View>
      </TouchableOpacity>

      <Progress.Bar
        progress={progresoBloque}
        width={null}
        height={12}
        color={colors.secondary}
        borderWidth={0}
        style={{ marginTop: 10 }}
      />

      <Text style={styles.progresoTexto}>
        Progreso: {completadas.length}/{tareas.length} ({Math.round(progresoBloque * 100)}%)
        {progresoBloque === 1 && ' ✅'}
      </Text>

      {desbloqueado && (
        <TouchableOpacity
          style={[styles.iniciarBloqueButton, {
            backgroundColor: colors.accent,
          }]}
          onPress={() => onIniciarTarea(bloque)}
        >
          <Text style={styles.iniciarBloqueButtonText}>
            {completadas.length === 0 ? '🎮 Comenzar Aventura' : '➡️ Continuar Jugando'}
          </Text>
        </TouchableOpacity>
      )}

      <Collapsible collapsed={bloqueActivo !== bloque}>
        {tareas.map((tarea, index) => {
          const completada = progreso.find((p) => p.id_tarea?._id === tarea._id);
          // CORREGIDO: Sin acento en "dificil"
          const dificultadNormalizada = tarea.dificultad ? 
            tarea.dificultad.toLowerCase().replace('í', 'i').replace('ó', 'o') : 'facil';
          
          return (
            <TareaCard
              key={tarea._id}
              tarea={tarea}
              index={index}
              completada={!!completada}
              desbloqueado={desbloqueado}
              onSelectTarea={onSelectTarea}
              dificultadNormalizada={dificultadNormalizada}
            />
          );
        })}
      </Collapsible>
    </Animatable.View>
  );
};

export default BloqueCard;