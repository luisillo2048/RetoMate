import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Alert, Modal } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { useTheme } from '../context/ThemeContext';
import { useTareas } from '../hooks/useTareas';
import BloqueCard from '../components/BloqueCard';
import TareaDetalle from '../components/TareaDetalle';
import LogroModal from '../components/LogroModal';

import { Tarea } from '../types/tarea';
import { verificarYDesbloquearLogros, normalizarDificultad, getDifficultyColor } from '../utils/storage';
import { stopSpeech } from '../utils/speech';
import { globalStyles } from '../themes/globalStyles';
import styles from '../themes/TasksStyles';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const TasksScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const {
    refreshing,
    tareasPorBloque,
    progreso,
    tareasRespondidasIds,
    bloques,
    onRefresh,
    setProgreso
  } = useTareas();

  const [bloqueActivo, setBloqueActivo] = useState<number | null>(null);
  const [bloquesDesbloqueados, setBloquesDesbloqueados] = useState<number[]>([1]);
  const [tareaActual, setTareaActual] = useState<Tarea | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tareasCompletadas, setTareasCompletadas] = useState(false);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [bloquearOpciones, setBloquearOpciones] = useState(false);
  const [bloqueCompletado, setBloqueCompletado] = useState(false);
  const [logroDesbloqueado, setLogroDesbloqueado] = useState<any>(null);
  const [showLogroModal, setShowLogroModal] = useState(false);
  const [erroresConsecutivos, setErroresConsecutivos] = useState(0);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  // Efecto para desbloquear bloques
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

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const toggleBloque = (bloque: number) => {
    setBloqueActivo(bloqueActivo === bloque ? null : bloque);
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

  const irAlChatbot = () => {
    setShowChatbotModal(false);
    setErroresConsecutivos(0);
    resetGameState();
    setTareaActual(null);
    navigation.navigate('Menu' as never);
  };

  const verificarRespuesta = async (opcion: string) => {
    if (!tareaActual || bloquearOpciones) return;
    
    setLoading(true);
    setSelected(opcion);
    setBloquearOpciones(true);

    try {
      const respuestaUsuario = opcion.trim().toLowerCase();
      const respuestaCorrecta = tareaActual.respuestaCorrecta?.trim().toLowerCase() || '';
      const esCorrecta = respuestaUsuario === respuestaCorrecta;

      setCorrecta(esCorrecta);
      setRespondido(true);
      // SOLO mostrar respuesta si es correcta
      setMostrarRespuesta(esCorrecta);

      if (esCorrecta) {
        setErroresConsecutivos(0);
      } else {
        const nuevosErrores = erroresConsecutivos + 1;
        setErroresConsecutivos(nuevosErrores);
        
        if (nuevosErrores >= 3) {
          setTimeout(() => {
            setShowChatbotModal(true);
          }, 1500);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const buscarSiguienteTarea = async (bloqueActual: number, dificultadSugerida: string, tareaActualId?: string): Promise<Tarea | null> => {
    try {
      const tareasBloque = tareasPorBloque[bloqueActual] || [];
      
      const tareasNoRespondidas = tareasBloque.filter(tarea => 
        !tareasRespondidasIds.has(tarea._id) && tarea._id !== tareaActualId
      );

      if (tareasNoRespondidas.length === 0) {
        return null;
      }

      const dificultadNormalizada = normalizarDificultad(dificultadSugerida);
      let siguienteTarea = tareasNoRespondidas.find(tarea => {
        const tareaDificultad = normalizarDificultad(tarea.dificultad || 'facil');
        return tareaDificultad === dificultadNormalizada;
      });

      if (!siguienteTarea) {
        const prioridades = ['dificil', 'media', 'facil'];
        for (const dificultad of prioridades) {
          siguienteTarea = tareasNoRespondidas.find(t => 
            normalizarDificultad(t.dificultad || 'facil') === dificultad
          );
          if (siguienteTarea) break;
        }
      }

      if (!siguienteTarea && tareasNoRespondidas.length > 0) {
        siguienteTarea = tareasNoRespondidas[0];
      }

      return siguienteTarea || null;

    } catch (error) {
      console.error('Error buscando siguiente tarea:', error);
      return null;
    }
  };

  const handleContinuar = async () => {
    if (!tareaActual) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token && correcta) {
        // Guardar respuesta en el backend
        const response = await axios.post(
          `${apiUrl}/tarea/${tareaActual._id}/responder`,
          { respuesta: selected },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { siguiente_tarea, siguiente_dificultad } = response.data;

        // Actualizar progreso local
        setProgreso(prev => [...prev, { id_tarea: { _id: tareaActual._id } }]);

        // VERIFICAR LOGROS
        const nuevosLogros = await verificarYDesbloquearLogros();
        console.log('Logros desbloqueados:', nuevosLogros);
        
        // MOSTRAR MODAL SI HAY LOGRO
        if (nuevosLogros && nuevosLogros._id) {
          setLogroDesbloqueado(nuevosLogros);
          setShowLogroModal(true);
        }

        // Buscar siguiente tarea
        if (siguiente_tarea) {
          setTareaActual(siguiente_tarea);
          resetGameState();
        } else {
          const bloqueActual = tareaActual.bloque || 1;
          const tareaAlternativa = await buscarSiguienteTarea(
            bloqueActual, 
            siguiente_dificultad || 'media',
            tareaActual._id
          );
          
          if (tareaAlternativa) {
            setTareaActual(tareaAlternativa);
            resetGameState();
          } else {
            setBloqueCompletado(true);
            setTareasCompletadas(true);
            resetGameState();
            setTareaActual(null);
          }
        }
      } else {
        // Si respondió mal, buscar siguiente tarea
        const bloqueActual = tareaActual.bloque || 1;
        const tareaAlternativa = await buscarSiguienteTarea(
          bloqueActual, 
          'facil',
          tareaActual._id
        );
        
        if (tareaAlternativa) {
          setTareaActual(tareaAlternativa);
          resetGameState();
        } else {
          setBloqueCompletado(true);
          setTareasCompletadas(true);
          resetGameState();
          setTareaActual(null);
        }
      }

    } catch (error: any) {
      console.error('Error en handleContinuar:', error);
      Alert.alert('Error', error.response?.data?.error || 'No se pudo guardar el progreso');
    } finally {
      setLoading(false);
    }
  };

  const resetGameState = () => {
    setSelected(null);
    setRespondido(false);
    setCorrecta(false);
    setMostrarRespuesta(false);
    setBloquearOpciones(false);
  };

  const iniciarTareaDesdeBloque = async (bloque: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se pudo autenticar');
        return;
      }

      const tareasBloque = tareasPorBloque[bloque] || [];
      let tareaParaIniciar = tareasBloque.find(tarea => {
        const noRespondida = !tareasRespondidasIds.has(tarea._id);
        const esFacil = normalizarDificultad(tarea.dificultad || 'facil') === 'facil';
        return noRespondida && esFacil;
      });

      if (!tareaParaIniciar) {
        tareaParaIniciar = tareasBloque.find(tarea => 
          !tareasRespondidasIds.has(tarea._id)
        );
      }

      if (tareaParaIniciar) {
        setTareaActual(tareaParaIniciar);
        setTareasCompletadas(false);
        setBloqueCompletado(false);
        setErroresConsecutivos(0);
        resetGameState();
      } else {
        Alert.alert('Bloque Completado', '¡Ya has completado todas las tareas de este bloque!');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la tarea');
    }
  };

  const handleSelectTarea = (tarea: Tarea) => {
    setTareaActual(tarea);
    setErroresConsecutivos(0);
    resetGameState();
  };

  const handleVolver = () => {
    resetGameState();
    setTareaActual(null);
    setErroresConsecutivos(0);
  };

  if (tareasCompletadas || bloqueCompletado) {
    return (
      <LinearGradient 
        colors={colors.background}
        style={globalStyles.container}
      >
        <View style={[styles.centered, { backgroundColor: 'transparent' }]}>
          <Animatable.View 
            animation="bounceIn" 
            duration={1000}
            iterationCount="infinite"
            iterationDelay={2000}
          >
            <Ionicons name="trophy" size={100} color="#FFD700" />
          </Animatable.View>
          <Animatable.Text 
            animation="pulse" 
            duration={1500} 
            iterationCount="infinite"
            style={[styles.finishedText, { color: colors.text }]}
          >
            ¡Bloque completado con éxito! 🎉
          </Animatable.Text>
          <Animatable.Text 
            animation="fadeInUp" 
            duration={800} 
            delay={200} 
            style={[styles.subText, { color: colors.text }]}
          >
            Eres un super estudiante 🌟
          </Animatable.Text>
          <Animatable.View 
            animation="rubberBand" 
            duration={1000} 
            delay={400}
            iterationCount="infinite"
            iterationDelay={3000}
          >
            <TouchableOpacity 
              style={[styles.homeButton, { backgroundColor: colors.primary }]} 
              onPress={() => {
                setTareasCompletadas(false);
                setBloqueCompletado(false);
                onRefresh();
              }}
            >
              <Text style={[styles.homeButtonText, { color: '#FFFFFF' }]}>Volver a la Aventura</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </LinearGradient>
    );
  }

  if (tareaActual) {
    return (
      <LinearGradient 
        colors={colors.background}
        style={globalStyles.container}
      >
        <View style={{ flex: 1 }}>
          <TareaDetalle
            tareaActual={tareaActual}
            selected={selected}
            respondido={respondido}
            correcta={correcta}
            loading={loading}
            mostrarRespuesta={mostrarRespuesta}
            bloquearOpciones={bloquearOpciones}
            erroresConsecutivos={erroresConsecutivos}
            onVerificarRespuesta={verificarRespuesta}
            onVolver={handleVolver}
            onContinuar={handleContinuar}
          />

          {/* 🔥 MODAL DE LOGRO - SIMPLE Y FUNCIONAL */}
          <LogroModal
            visible={showLogroModal}
            logro={logroDesbloqueado}
            onClose={() => setShowLogroModal(false)}
          />

          {/* Modal de Invitación al Chatbot */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showChatbotModal}
            onRequestClose={() => setShowChatbotModal(false)}
          >
            <View style={styles.modalOverlay}>
              <Animatable.View 
                style={[styles.modalContainer, { backgroundColor: colors.card }]}
                animation="bounceIn"
                duration={600}
              >
                <View style={styles.modalHeader}>
                  <Animatable.View
                    animation="pulse"
                    duration={2000}
                    iterationCount="infinite"
                  >
                    <Ionicons name="school" size={50} color={colors.secondary} />
                  </Animatable.View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>¡Te invitamos a practicar! 📚</Text>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    Notamos que estás teniendo dificultades. ¿Por qué no practicas con nuestro asistente virtual?
                  </Text>
                  
                  <View style={styles.benefitsContainer}>
                    <Animatable.View 
                      style={styles.benefitItem}
                      animation="fadeInLeft"
                      duration={500}
                      delay={200}
                    >
                      <Ionicons name="bulb" size={20} color="#FFD700" />
                      <Text style={[styles.benefitText, { color: colors.text }]}>Explicaciones paso a paso</Text>
                    </Animatable.View>
                    <Animatable.View 
                      style={styles.benefitItem}
                      animation="fadeInLeft"
                      duration={500}
                      delay={400}
                    >
                      <Ionicons name="heart" size={20} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.text }]}>Aprendizaje personalizado</Text>
                    </Animatable.View>
                    <Animatable.View 
                      style={styles.benefitItem}
                      animation="fadeInLeft"
                      duration={500}
                      delay={600}
                    >
                      <Ionicons name="rocket" size={20} color={colors.secondary} />
                      <Text style={[styles.benefitText, { color: colors.text }]}>Mejora tus habilidades</Text>
                    </Animatable.View>
                  </View>
                </View>
                
                <View style={styles.modalButtonsContainer}>
                  <Animatable.View
                    animation="pulse"
                    duration={1500}
                    iterationCount="infinite"
                  >
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                      onPress={irAlChatbot}
                    >
                      <Ionicons name="chatbubbles" size={20} color="#FFF" />
                      <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Ir al Asistente</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setShowChatbotModal(false);
                      setErroresConsecutivos(0);
                      resetGameState();
                      setTareaActual(null);
                    }}
                  >
                    <Ionicons name="close" size={20} color="#FFF" />
                    <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Quizás después</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={colors.background}
      style={globalStyles.container}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={globalStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View 
            animation="fadeInDown" 
            duration={800}
          >
            <Text style={[styles.titulo, { color: colors.text }]}>Aventura de Aprendizaje 🎒</Text>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInUp" 
            duration={800} 
            delay={200} 
            style={[styles.progressContainer, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.progressLabel, { color: colors.text }]}>Progreso Total</Text>
            <Progress.Bar
              progress={calcularProgresoTotal()}
              width={null}
              height={12}
              color={colors.secondary}
              borderWidth={0}
              unfilledColor={colors.border}
            />
            <Text style={[styles.progressPercentage, { color: colors.text }]}>
              {Math.round(calcularProgresoTotal() * 100)}%
            </Text>
          </Animatable.View>

          {bloques.map((bloque, index) => (
            <Animatable.View
              key={bloque}
              animation="fadeInUp"
              duration={600}
              delay={300 + (index * 100)}
            >
              <BloqueCard
                bloque={bloque}
                tareas={tareasPorBloque[bloque] || []}
                progreso={progreso}
                desbloqueado={bloquesDesbloqueados.includes(bloque)}
                bloqueActivo={bloqueActivo}
                onToggleBloque={toggleBloque}
                onIniciarTarea={iniciarTareaDesdeBloque}
                onSelectTarea={handleSelectTarea}
                tareasRespondidasIds={tareasRespondidasIds}
              />
            </Animatable.View>
          ))}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default TasksScreen;