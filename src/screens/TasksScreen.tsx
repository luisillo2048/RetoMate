import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Alert, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTareas } from '../hooks/useTareas';
import BloqueCard  from '../components/BloqueCard';
import TareaDetalle from '../components/TareaDetalle';
import LogroModal from '../components/LogroModal';

import { Tarea } from '../types';
import { verificarYDesbloquearLogros, normalizarDificultad, getDifficultyColor } from '../utils/storage';
import { stopSpeech } from '../utils/speech';
import styles from '../themes/TasksStyles';


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const TasksScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  // Estados del hook de tareas
  const {
    refreshing,
    tareasPorBloque,
    progreso,
    tareasRespondidasIds,
    bloques,
    onRefresh,
    setProgreso
  } = useTareas();

  // Estados de la UI
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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [bloqueCompletado, setBloqueCompletado] = useState(false);
  const [mensajeEspecial, setMensajeEspecial] = useState<string | null>(null);
  const [logroDesbloqueado, setLogroDesbloqueado] = useState<any>(null);
  const [showLogroModal, setShowLogroModal] = useState(false);

  // Estados para el sistema de 3 oportunidades
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

  // Cleanup effect
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

  // Función para manejar el chatbot - navegar al MenuScreen
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
      setMostrarRespuesta(true);

      // Lógica de 3 oportunidades
      if (esCorrecta) {
        setErroresConsecutivos(0);
        setShowCompletionModal(true);
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

  // FUNCIÓN CORREGIDA: Buscar siguiente tarea sin repetir las ya contestadas
  const buscarSiguienteTarea = async (bloqueActual: number, dificultadSugerida: string) => {
    try {
      const tareasBloque = tareasPorBloque[bloqueActual] || [];
      
      // Filtrar solo tareas NO respondidas
      const tareasNoRespondidas = tareasBloque.filter(tarea => 
        !tareasRespondidasIds.has(tarea._id)
      );

      if (tareasNoRespondidas.length === 0) {
        return null; // No hay más tareas en este bloque
      }

      const dificultadNormalizada = normalizarDificultad(dificultadSugerida);

      // Buscar tarea de la dificultad sugerida que NO haya sido respondida
      let siguienteTarea = tareasNoRespondidas.find(tarea => {
        const tareaDificultad = normalizarDificultad(tarea.dificultad || 'facil');
        return tareaDificultad === dificultadNormalizada;
      });

      // Si no encuentra de la dificultad sugerida, buscar cualquier tarea no respondida
      if (!siguienteTarea) {
        // Prioridad: media -> facil -> dificil
        const prioridades = ['media', 'facil', 'dificil'];
        for (const dificultad of prioridades) {
          siguienteTarea = tareasNoRespondidas.find(t => 
            normalizarDificultad(t.dificultad || 'facil') === dificultad
          );
          if (siguienteTarea) break;
        }
      }

      // Si aún no encuentra, tomar la primera tarea no respondida
      if (!siguienteTarea && tareasNoRespondidas.length > 0) {
        siguienteTarea = tareasNoRespondidas[0];
      }

      return siguienteTarea;

    } catch (error) {
      console.error('Error buscando siguiente tarea:', error);
      return null;
    }
  };

  const handleContinuar = async () => {
    if (!tareaActual || !selected) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        if (correcta) {
          const response = await axios.post(
            `${apiUrl}/tarea/${tareaActual._id}/responder`,
            { 
              respuesta: selected
            },
            { 
              headers: { Authorization: `Bearer ${token}` } 
            }
          );

          const { 
            siguiente_tarea, 
            logroDesbloqueado,
            siguiente_dificultad,
            mensaje 
          } = response.data;

          // 🔥 ACTUALIZAR PROGRESO LOCALMENTE
          if (correcta) {
            setProgreso(prev => [...prev, { id_tarea: { _id: tareaActual._id } }]);
          }

          // 🔥 NUEVO: Verificar y desbloquear logros automáticamente
          const nuevoLogro = await verificarYDesbloquearLogros();
          if (nuevoLogro) {
            setLogroDesbloqueado(nuevoLogro);
            setShowLogroModal(true);
          }

          if (siguiente_tarea) {
            setTareaActual(siguiente_tarea);
            resetGameState();
          } else {
            const bloqueActual = tareaActual.bloque || 1;
            const tareaAlternativa = await buscarSiguienteTarea(bloqueActual, siguiente_dificultad);
            
            if (tareaAlternativa) {
              setTareaActual(tareaAlternativa);
              resetGameState();
            } else {
              setBloqueCompletado(true);
              setTareasCompletadas(true);
              resetGameState();
              setTareaActual(null);
              
              Alert.alert(
                '¡Bloque Completado! 🎉', 
                'Has completado todas las tareas de este bloque.'
              );
            }
          }
        } else {
          // Si respondió mal, buscar siguiente tarea sin repetir
          const bloqueActual = tareaActual.bloque || 1;
          const tareaAlternativa = await buscarSiguienteTarea(bloqueActual, 'facil');
          
          if (tareaAlternativa) {
            setTareaActual(tareaAlternativa);
            resetGameState();
          } else {
            setBloqueCompletado(true);
            setTareasCompletadas(true);
            resetGameState();
            setTareaActual(null);
            
            Alert.alert(
              '¡Bloque Completado! 🎉', 
              'Has completado todas las tareas de este bloque.'
            );
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo guardar el progreso');
    } finally {
      setLoading(false);
      setShowCompletionModal(false);
    }
  };

  const resetGameState = () => {
    setSelected(null);
    setRespondido(false);
    setCorrecta(false);
    setMostrarRespuesta(false);
    setBloquearOpciones(false);
    setMensajeEspecial(null);
  };

  const iniciarTareaDesdeBloque = async (bloque: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se pudo autenticar');
        return;
      }

      const tareasBloque = tareasPorBloque[bloque] || [];
      
      // Buscar PRIMERO tareas fáciles NO respondidas
      let tareaParaIniciar = tareasBloque.find(tarea => {
        const noRespondida = !tareasRespondidasIds.has(tarea._id);
        const esFacil = normalizarDificultad(tarea.dificultad || 'facil') === 'facil';
        return noRespondida && esFacil;
      });

      // Si no hay fáciles, buscar cualquier tarea NO respondida
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
        Alert.alert(
          'Bloque Completado', 
          '¡Ya has completado todas las tareas de este bloque!'
        );
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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Animatable.View
          animation="bounceIn"
          duration={1000}
        >
          <Ionicons name="trophy" size={100} color="#FFD700" />
        </Animatable.View>
        <Animatable.Text 
          animation="fadeInUp" 
          duration={800}
          style={styles.finishedText}
        >
          ¡Bloque completado con éxito! 🎉
        </Animatable.Text>
        <Animatable.Text 
          animation="fadeInUp" 
          duration={800}
          delay={200}
          style={styles.subText}
        >
          Eres un super estudiante 🌟
        </Animatable.Text>
        
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={400}
        >
          <TouchableOpacity 
            style={[styles.homeButton, {
              backgroundColor: colors.primary,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }]} 
            onPress={() => {
              setTareasCompletadas(false);
              setBloqueCompletado(false);
              onRefresh();
            }}
          >
            <Text style={styles.homeButtonText}>Volver a la Aventura</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }

  if (tareaActual) {
    return (
      <>
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

        {/* Modal de Tarea Completada */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCompletionModal && correcta}
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View 
              style={styles.modalContainer}
              animation="bounceIn"
              duration={600}
            >
              <View style={styles.modalHeader}>
                <Ionicons name="checkmark-done-circle" size={50} color="#4CAF50" />
                <Text style={styles.modalTitle}>¡Tarea Completada!</Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>¡Eres un genio! 🌟</Text>
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalInfoLabel}>Dificultad:</Text>
                  <Text style={[styles.modalInfoValue, { 
                    color: getDifficultyColor(tareaActual.dificultad) 
                  }]}>
                    {normalizarDificultad(tareaActual.dificultad || 'facil')}
                  </Text>
                </View>
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalInfoLabel}>Puntos ganados:</Text>
                  <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.modalInfoValue}>{tareaActual?.puntaje || 0}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.modalButton, {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }]}
                onPress={handleContinuar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Continuar Aventura</Text>
                )}
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>

        {/* Modal de Logro Desbloqueado */}
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
              style={[styles.modalContainer, { backgroundColor: '#FFF' }]}
              animation="bounceIn"
              duration={600}
            >
              <View style={styles.modalHeader}>
                <Ionicons name="school" size={50} color={colors.secondary} />
                <Text style={styles.modalTitle}>¡Te invitamos a practicar! 📚</Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  Notamos que estás teniendo dificultades. ¿Por qué no practicas con nuestro asistente virtual?
                </Text>
                
                <View style={styles.benefitsContainer}>
                  <View style={styles.benefitItem}>
                    <Ionicons name="bulb" size={20} color="#FFD700" />
                    <Text style={styles.benefitText}>Explicaciones paso a paso</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="heart" size={20} color={colors.primary} />
                    <Text style={styles.benefitText}>Aprendizaje personalizado</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="rocket" size={20} color={colors.secondary} />
                    <Text style={styles.benefitText}>Mejora tus habilidades</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { 
                    backgroundColor: colors.secondary,
                    marginRight: 10 
                  }]}
                  onPress={irAlChatbot}
                >
                  <Ionicons name="chatbubbles" size={20} color="#FFF" />
                  <Text style={styles.modalButtonText}>Ir al Asistente</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, { 
                    backgroundColor: colors.primary,
                    marginLeft: 10 
                  }]}
                  onPress={() => {
                    setShowChatbotModal(false);
                    setErroresConsecutivos(0);
                    resetGameState();
                    setTareaActual(null);
                  }}
                >
                  <Ionicons name="close" size={20} color="#FFF" />
                  <Text style={styles.modalButtonText}>Quizás después</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.mainScrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={true}
    >
      <Animatable.View
        animation="fadeInDown"
        duration={800}
      >
        <Text style={styles.titulo}>Aventura de Aprendizaje 🎒</Text>
      </Animatable.View>
      
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={200}
        style={styles.progressContainer}
      >
        <Text style={styles.progressLabel}>Progreso Total</Text>
        <Progress.Bar
          progress={calcularProgresoTotal()}
          width={null}
          height={12}
          color={colors.secondary}
          borderWidth={0}
        />
        <Text style={styles.progressPercentage}>
          {Math.round(calcularProgresoTotal() * 100)}%
        </Text>
      </Animatable.View>

      {bloques.map((bloque) => (
        <BloqueCard
          key={bloque}
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
      ))}
      
      {/* Espacio extra para asegurar que se pueda scrollear completamente */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default TasksScreen;