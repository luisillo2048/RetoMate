import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ProfileScreen = () => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [totalPuntaje, setTotalPuntaje] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!auth?.user || !token) {
        setProgressLoading(false);
        return;
      }

      const response = await axios.get(
        `${apiUrl}/progreso/progreso/${auth.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(response.data);

      const resumenResponse = await axios.get(
        `${apiUrl}/progreso/${auth.user.id}/resumen`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalPuntaje(resumenResponse.data.totalPuntaje);

    } catch (err: any) {
      console.error("Error al cargar el progreso:", err?.response?.data || err.message);
    } finally {
      setProgressLoading(false);
      setRefreshing(false);
    }
  }, [auth?.user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user) {
        setLoading(false);
      } else {
        setError("No se pudo cargar la información del usuario.");
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [auth?.user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="dodgerblue" />
        <Text style={styles.text}>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const progressPercentage = totalPuntaje / 100;

  return (
    <FlatList
      data={progress}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.progressItem}>
          <Text style={styles.text}>Tarea: {item.id_tarea?.pregunta || "Sin título"}</Text>
          <Text style={styles.text}>Puntaje: {item.puntaje}</Text>
          <Text style={styles.text}>
            Fecha: {new Date(item.fecha_progreso).toLocaleString()}
          </Text>
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Sección de Perfil */}
          <View style={styles.profileSection}>
            <Text style={styles.title}>Perfil</Text>
            {auth?.user ? (
              <>
                <Text style={styles.text}>Nombre: {auth.user.username}</Text>
                <Text style={styles.text}>Correo: {auth.user.email}</Text>
              </>
            ) : (
              <Text style={styles.text}>No hay usuario autenticado.</Text>
            )}
          </View>

          {/* Sección de Progreso */}
          <View style={{ marginTop: 30, width: "100%" }}>
            <Text style={styles.title}>Mi Progreso</Text>
            {progressLoading ? (
              <ActivityIndicator size="large" color="dodgerblue" />
            ) : progress.length === 0 ? (
              <Text style={styles.text}>No tienes progreso registrado.</Text>
            ) : (
              <>
                <Text style={styles.text}>Puntaje Total: {totalPuntaje} / 100</Text>
                <Progress.Bar
                  progress={progressPercentage}
                  width={null}
                  height={20}
                  color="dodgerblue"
                  borderWidth={0}
                  style={styles.progressBar}
                />
              </>
            )}
          </View>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["dodgerblue"]}
          tintColor="dodgerblue"
        />
      }
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "dodgerblue",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  progressItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    width: "100%",
  },
  progressBar: {
    marginVertical: 20,
    width: "100%",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default ProfileScreen;