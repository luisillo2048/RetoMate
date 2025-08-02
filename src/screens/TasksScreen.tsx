import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import * as Speech from 'expo-speech';
import styles from '../themes/TasksStyles';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Tarea {
  _id: string;
  pregunta: string;
  puntaje: number;
  dificultad?: string;
  opciones?: string[];
  respuestaCorrecta?: string;
  imagen?: string;
}

const TasksScreen = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tareasPorBloque, setTareasPorBloque] = useState<Record<number, Tarea[]>>({});
  const [bloqueActivo, setBloqueActivo] = useState<number | null>(null);
  const [progreso, setProgreso] = useState<any[]>([]);
  const [bloquesDesbloqueados, setBloquesDesbloqueados] = useState<number[]>([1]);
  const [tareaActual, setTareaActual] = useState<Tarea | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tareasCompletadas, setTareasCompletadas] = useState(false);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [bloquearOpciones, setBloquearOpciones] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const bloques = [1, 2, 3, 4, 5, 6];

  const leerTexto = (texto: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
    Speech.speak(texto, {
      language: 'es-ES',
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (tareaActual) {
      leerTexto(tareaActual.pregunta);
    }
  }, [tareaActual]);

  const loadData = useCallback(async () => {
    try {
      await Promise.all(
        bloques.map(async (bloque) => {
          const response = await axios.get(`${apiUrl}/tarea/tareas/bloque/${bloque}`);
          setTareasPorBloque((prev) => ({ ...prev, [bloque]: response.data }));
        })
      );

      if (user) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const progresoResponse = await axios.get(`${apiUrl}/progreso/progreso/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProgreso(progresoResponse.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    const nuevosDesbloqueados = [1];

    bloques.forEach((bloque, index) => {
      const tareas = tareasPorBloque[bloque] || [];
      const completadas = tareas.filter((tarea) =>
        progreso.find((p) => p.id_tarea?._id === tarea._id)
      );

      const progresoBloque = tareas.length > 0 ? completadas.length / tareas.length : 0;

      if (progresoBloque >= 1 && index + 1 < bloques.length) {
        nuevosDesbloqueados.push(bloques[index + 1]);
      }
    });

    setBloquesDesbloqueados(nuevosDesbloqueados);
  }, [progreso, tareasPorBloque]);

  const toggleBloque = (bloque: number) => {
    setBloqueActivo(bloqueActivo === bloque ? null : bloque);
  };

  const calcularProgresoBloque = (bloque: number) => {
    const tareas = tareasPorBloque[bloque] || [];
    const completadas = tareas.filter((tarea) =>
      progreso.find((p) => p.id_tarea?._id === tarea._id)
    );
    return tareas.length > 0 ? completadas.length / tareas.length : 0;
  };

  const calcularProgresoTotal = () => {
    let totalTareas = 0;
    let totalCompletadas = 0;

    bloques.forEach((bloque) => {
      const tareas = tareasPorBloque[bloque] || [];
      totalTareas += tareas.length;
      totalCompletadas += tareas.filter((tarea) =>
        progreso.find((p) => p.id_tarea?._id === tarea._id)
      ).length;
    });

    return totalTareas > 0 ? totalCompletadas / totalTareas : 0;
  };

  const getDifficultyColor = (dificultad?: string) => {
    switch (dificultad?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return '#4CAF50';
      case 'media':
      case 'intermedio':
        return '#FFC107';
      case 'difícil':
      case 'dificil':
      case 'avanzado':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const verificarRespuesta = (opcion: string) => {
    if (!tareaActual || bloquearOpciones) return;
    
    setLoading(true);
    setSelected(opcion);
    setBloquearOpciones(true);

    setTimeout(async () => {
      try {
        const respuestaUsuario = opcion.trim().toLowerCase();
        const respuestaCorrecta = tareaActual.respuestaCorrecta?.trim().toLowerCase() || '';
        const esCorrecta = respuestaUsuario === respuestaCorrecta;

        setCorrecta(esCorrecta);
        setRespondido(true);
        setMostrarRespuesta(true);
        setLoading(false);

        if (esCorrecta) {
          setShowCompletionModal(true);
        }
      } catch (error) {
        console.error('Error al verificar respuesta:', error);
        setLoading(false);
        setBloquearOpciones(false);
      }
    }, 1000);
  };

  const handleContinuar = async () => {
    if (!tareaActual) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && tareaActual._id) {
        const response = await axios.post(
          `${apiUrl}/tarea/${tareaActual._id}/responder`,
          { respuesta: selected, correcta },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { siguiente_tarea, bloque_completado } = response.data;

        if (siguiente_tarea) {
          setTareaActual(siguiente_tarea);
          resetGameState();
        } else if (bloque_completado) {
          setTareasCompletadas(true);
        } else {
          resetGameState();
          await loadData();
        }
      }
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    } finally {
      setLoading(false);
      setShowCompletionModal(false);
    }
  };

  const resetGameState = () => {
    setTareaActual(null);
    setSelected(null);
    setRespondido(false);
    setCorrecta(false);
    setMostrarRespuesta(false);
    setBloquearOpciones(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }
    
    const baseUrl = apiUrl?.startsWith('http') ? apiUrl : `https://${apiUrl}`;
    return `${baseUrl}/${imagePath.replace(/^\//, '')}`;
  };

  const renderTareasDeBloque = (bloque: number) => {
    const tareas = tareasPorBloque[bloque] || [];
    const progresoBloque = calcularProgresoBloque(bloque);
    const desbloqueado = bloquesDesbloqueados.includes(bloque);
    const completadas = tareas.filter((tarea) =>
      progreso.find((p) => p.id_tarea?._id === tarea._id)
    );

    return (
      <View key={bloque} style={styles.bloqueContainer}>
        <TouchableOpacity onPress={() => toggleBloque(bloque)} disabled={!desbloqueado}>
          <Animatable.View
            animation={desbloqueado && bloqueActivo !== bloque ? 'bounceIn' : undefined}
            style={[styles.bloqueBoton, { backgroundColor: desbloqueado ? '#DBA975' : '#ccc' }]}
          >
            <Text style={styles.bloqueTitulo}>
              {desbloqueado ? '🔓' : '🔒'} Bloque {bloque}
            </Text>
          </Animatable.View>
        </TouchableOpacity>

        <Progress.Bar
          progress={progresoBloque}
          width={null}
          height={10}
          color="#4B3F2F"
          borderWidth={0}
          style={{ marginTop: 10 }}
        />

        <Text style={styles.progresoTexto}>
          Progreso: {completadas.length}/{tareas.length} ({Math.round(progresoBloque * 100)}%)
        </Text>

        <Collapsible collapsed={bloqueActivo !== bloque}>
          {tareas.map((tarea) => {
            const completada = progreso.find((p) => p.id_tarea?._id === tarea._id);
            return (
              <TouchableOpacity
                key={tarea._id}
                style={[styles.tareaContainer, completada && styles.tareaCompletada]}
                onPress={() => {
                  if (!completada) {
                    setTareaActual(tarea);
                  }
                }}
                activeOpacity={completada ? 1 : 0.7}
                disabled={!!completada}
              >
                <View style={styles.tareaHeader}>
                  <Text style={styles.tareaPregunta}>{tarea.pregunta}</Text>
                  {completada && <FontAwesome name="check-circle" size={20} color="#4CAF50" />}
                </View>
                <View style={styles.tareaFooter}>
                  <Text style={styles.tareaPuntaje}>Puntaje: {tarea.puntaje}</Text>
                  {tarea.dificultad && (
                    <Text style={[styles.tareaDificultad, { 
                      backgroundColor: getDifficultyColor(tarea.dificultad) 
                    }]}>
                      {tarea.dificultad}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </Collapsible>
      </View>
    );
  };

  if (tareasCompletadas) {
    return (
      <View style={styles.centered}>
        <Ionicons name="trophy" size={80} color="#FFD700" />
        <Text style={styles.finishedText}>¡Bloque completado con éxito! 🎉</Text>
        <Text style={styles.subText}>Has terminado todas las tareas de este bloque</Text>
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => {
            setTareasCompletadas(false);
            loadData();
          }}
        >
          <Text style={styles.homeButtonText}>Volver a Tareas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tareaActual) {
    const imageUrl = getImageUrl(tareaActual.imagen || '');

    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#DBA975']}
              tintColor="#DBA975"
            />
          }
        >
          {imageUrl && (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.imagen}
              resizeMode="contain"
              onError={(e) => console.log('Error al cargar imagen:', e.nativeEvent.error)}
            />
          )}
          
          <View style={styles.questionHeader}>
            <Text style={styles.title}>{tareaActual.pregunta}</Text>
            <TouchableOpacity onPress={() => leerTexto(tareaActual.pregunta)}>
              <Ionicons 
                name={isSpeaking ? 'volume-high' : 'volume-medium'} 
                size={24} 
                color="#4B3F2F" 
              />
            </TouchableOpacity>
          </View>

          {tareaActual.dificultad && (
            <View style={styles.difficultyContainer}>
              <Text style={[styles.difficultyText, { 
                backgroundColor: getDifficultyColor(tareaActual.dificultad) 
              }]}>
                Dificultad: {tareaActual.dificultad}
              </Text>
            </View>
          )}

          {tareaActual.opciones?.map((opcion, index) => {
            const isSelected = selected === opcion;
            const isCorrect = opcion === tareaActual.respuestaCorrecta;

            let backgroundColor = '#F0F0F0';
            if (respondido && mostrarRespuesta) {
              if (isSelected && isCorrect) backgroundColor = '#A2F2B2';
              else if (isSelected && !isCorrect) backgroundColor = '#F2A2A2';
              else if (isCorrect) backgroundColor = '#CFFFCF';
            } else if (isSelected) {
              backgroundColor = '#E0E0E0';
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor }]}
                disabled={respondido || loading || bloquearOpciones}
                onPress={() => verificarRespuesta(opcion)}
                onLongPress={() => leerTexto(opcion)}
              >
                <Text style={styles.optionText}>{opcion}</Text>
              </TouchableOpacity>
            );
          })}

          {loading && <ActivityIndicator size="large" color="#BB86F2" style={{ marginTop: 20 }} />}

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
                style={styles.nextButton}
                onPress={handleContinuar}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Modal de Tarea Completada */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCompletionModal && correcta}
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Ionicons name="checkmark-done-circle" size={50} color="#4CAF50" />
                <Text style={styles.modalTitle}>¡Tarea Completada!</Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>Has completado esta tarea correctamente</Text>
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalInfoLabel}>Dificultad:</Text>
                  <Text style={[styles.modalInfoValue, { 
                    color: getDifficultyColor(tareaActual?.dificultad) 
                  }]}>
                    {tareaActual?.dificultad || 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalInfoLabel}>Puntos ganados:</Text>
                  <Text style={styles.modalInfoValue}>{tareaActual?.puntaje || 0}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleContinuar}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#DBA975']}
          tintColor="#DBA975"
        />
      }
    >
      <Text style={styles.titulo}>Tareas por Bloque</Text>
      <Progress.Bar
        progress={calcularProgresoTotal()}
        width={null}
        height={12}
        color="#4B3F2F"
        borderWidth={0}
        style={{ marginBottom: 20 }}
      />
      {bloques.map((bloque) => renderTareasDeBloque(bloque))}
    </ScrollView>
  );
};

export default TasksScreen;