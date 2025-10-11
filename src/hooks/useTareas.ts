import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Tarea } from '../types';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useTareas = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tareasPorBloque, setTareasPorBloque] = useState<Record<number, Tarea[]>>({});
  const [progreso, setProgreso] = useState<any[]>([]);
  const [tareasRespondidasIds, setTareasRespondidasIds] = useState<Set<string>>(new Set());

  const bloques = [1, 2, 3, 4, 5, 6];

  // Track de tareas respondidas
  useEffect(() => {
    const respondedIds = new Set(progreso.map(p => p.id_tarea?._id).filter(id => id));
    setTareasRespondidasIds(respondedIds);
  }, [progreso]);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      
      await Promise.all(
        bloques.map(async (bloque) => {
          try {
            const response = await axios.get(`${apiUrl}/tarea/tareas/bloque/${bloque}`);
            setTareasPorBloque((prev) => ({ ...prev, [bloque]: response.data }));
          } catch (error) {
            // Error silencioso para bloques individuales
          }
        })
      );

      if (user) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          try {
            const progresoResponse = await axios.get(`${apiUrl}/progreso/progreso/${user.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setProgreso(progresoResponse.data);
          } catch (error) {
            // Error silencioso para progreso
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
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

  return {
    refreshing,
    tareasPorBloque,
    progreso,
    tareasRespondidasIds,
    bloques,
    loadData,
    onRefresh,
    setProgreso,
    setTareasPorBloque
  };
};