import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext'; 

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Tarea {
  _id: string;
  pregunta: string;
  puntaje: number;
}

const TasksScreen = () => {
  const { user } = useAuth(); 
  const navigation = useNavigation(); 
  const [refreshing, setRefreshing] = useState(false);

  const [tareasPorBloque, setTareasPorBloque] = useState<Record<number, Tarea[]>>({});
  const [bloqueActivo, setBloqueActivo] = useState<number | null>(null);
  const [progreso, setProgreso] = useState<any[]>([]);
  const [bloquesDesbloqueados, setBloquesDesbloqueados] = useState<number[]>([1]);

  const bloques = [1, 2, 3, 4, 5, 6];

  // Función para cargar datos
  const loadData = useCallback(async () => {
    try {
      // Cargar tareas por bloque
      await Promise.all(
        bloques.map(async (bloque) => {
          const response = await axios.get(`${apiUrl}/tarea/tareas/bloque/${bloque}`);
          setTareasPorBloque((prev) => ({ ...prev, [bloque]: response.data }));
        })
      );

      // Cargar progreso del usuario
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

  // Efecto inicial para cargar datos
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Calcular bloques desbloqueados
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

  // Resto del código se mantiene igual...
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
                onPress={() =>
                  !completada &&
                  navigation.navigate('Games', { tarea: JSON.stringify(tarea) })
                }
                activeOpacity={completada ? 1 : 0.7}
                disabled={!!completada}
              >
                <Text style={styles.tareaPregunta}>{tarea.pregunta}</Text>
                <Text style={styles.tareaPuntaje}>Puntaje: {tarea.puntaje}</Text>
              </TouchableOpacity>
            );
          })}
        </Collapsible>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#DBA975']} // Color del spinner
          tintColor="#DBA975" // Color del spinner (iOS)
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

// Estilos se mantienen exactamente igual
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8F0' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#4B3F2F', textAlign: 'center' },
  bloqueContainer: { marginBottom: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  bloqueBoton: { padding: 12, borderRadius: 8, alignItems: 'center' },
  bloqueTitulo: { fontSize: 18, fontWeight: 'bold', color: '#4B3F2F' },
  tareaContainer: { backgroundColor: '#F7E9D7', padding: 12, borderRadius: 8, marginTop: 10 },
  tareaPregunta: { fontSize: 16, fontWeight: '600', color: '#4B3F2F' },
  tareaPuntaje: { fontSize: 14, color: '#4B3F2F', marginTop: 4 },
  progresoTexto: { marginTop: 4, fontSize: 14, fontWeight: '600', color: '#4B3F2F', textAlign: 'center' },
  tareaCompletada: { opacity: 0.4 },
});

export default TasksScreen;