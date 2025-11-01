import { useContext, useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressItem} from "../types/profile";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useProfile = () => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [totalPuntaje, setTotalPuntaje] = useState<number>(0);
  const [spentPoints, setSpentPoints] = useState<number>(0);
  const [availablePoints, setAvailablePoints] = useState<number>(0);

  const loadSpentPoints = async (): Promise<number> => {
    try {
      if (!auth?.user?.id) return 0;
      const SPENT_POINTS_KEY = `spent_points_${auth.user.id}`;
      const savedSpentPoints = await AsyncStorage.getItem(SPENT_POINTS_KEY);
      return savedSpentPoints ? parseInt(savedSpentPoints) : 0;
    } catch (error) {
      return 0;
    }
  };

  const loadData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!auth?.user || !token) {
        setProgress([]);
        setTotalPuntaje(0);
        setAvailablePoints(0);
        setProgressLoading(false);
        return;
      }

      // Cargar progreso
      const response = await axios.get(
        `${apiUrl}/progreso/progreso/${auth.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(response.data);

      // Cargar resumen de puntos
      const resumenResponse = await axios.get(
        `${apiUrl}/progreso/${auth.user.id}/resumen`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const totalFromAPI = resumenResponse.data.totalPuntaje || 0;
      setTotalPuntaje(totalFromAPI);

      // Cargar puntos gastados
      const spent = await loadSpentPoints();
      setSpentPoints(spent);

      // Calcular puntos disponibles
      const available = Math.max(0, totalFromAPI - spent);
      setAvailablePoints(available);

    } catch (err: any) {
      console.error(
        "Error al cargar el progreso:",
        err?.response?.data || err.message
      );
      if (err.response?.status !== 401 && auth?.user) {
        Alert.alert("¡Ups! 🚨", "No se pudo cargar tu progreso mágico");
      }
    } finally {
      setProgressLoading(false);
      setRefreshing(false);
    }
  }, [auth?.user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user) {
        setLoading(false);
        loadData();
      } else {
        setError("No se pudo cargar la información del usuario.");
        setLoading(false);
        setProgress([]);
        setTotalPuntaje(0);
        setAvailablePoints(0);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [auth?.user, loadData]);

  return {
    loading,
    error,
    refreshing,
    progress,
    progressLoading,
    totalPuntaje,
    spentPoints,
    availablePoints,
    onRefresh,
    loadData
  };
};