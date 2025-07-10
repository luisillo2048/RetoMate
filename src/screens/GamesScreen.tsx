import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function GamesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { tarea } = route.params || {};
  
  const [tareaObj, setTareaObj] = useState(null);
  const [selected, setSelected] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [correcta, setCorrecta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tareasCompletadas, setTareasCompletadas] = useState(false);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  useEffect(() => {
    if (tarea) {
      try {
        const parsed = typeof tarea === 'string' ? JSON.parse(tarea) : tarea;
        setTareaObj(parsed);
        setSelected(null);
        setRespondido(false);
        setCorrecta(false);
        setMostrarRespuesta(false);
      } catch (error) {
        console.error('Error al interpretar la tarea:', error);
        navigation.goBack();
      }
    }
  }, [tarea]);

  const verificarRespuesta = (opcion) => {
    if (!tareaObj) return;
    
    setLoading(true);
    setSelected(opcion);

    setTimeout(async () => {
      try {
        const respuestaUsuario = opcion.trim().toLowerCase();
        const respuestaCorrecta = tareaObj.respuestaCorrecta.trim().toLowerCase();
        const esCorrecta = respuestaUsuario === respuestaCorrecta;

        setCorrecta(esCorrecta);
        setRespondido(true);
        setMostrarRespuesta(true);
        setLoading(false);

        if (esCorrecta) {
          await saveProgress(opcion);
        }
      } catch (error) {
        console.error('Error al verificar respuesta:', error);
        setLoading(false);
      }
    }, 1000);
  };

  const saveProgress = async (respuestaUsuario) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !tareaObj?._id) return;

      const response = await axios.post(
        `${apiUrl}/tarea/${tareaObj._id}/responder`,
        { respuesta: respuestaUsuario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { siguiente_tarea, bloque_completado } = response.data;

      if (siguiente_tarea) {
        setTareaObj(siguiente_tarea);
      } else if (bloque_completado) {
        setTareasCompletadas(true);
      } else {
        navigation.navigate('Tasks', { refresh: Date.now() });
      }
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si la imagen ya es una URL completa (http/https)
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }
    
    // Si la imagen es una ruta relativa, construir la URL completa
    const baseUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
    return `${baseUrl}/${imagePath.replace(/^\//, '')}`;
  };

  if (!tareaObj && !tareasCompletadas) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Cargando tarea...</Text>
      </View>
    );
  }

  if (tareasCompletadas) {
    return (
      <View style={styles.centered}>
        <Ionicons name="trophy" size={80} color="#FFD700" />
        <Text style={styles.finishedText}>¡Bloque completado con éxito! 🎉</Text>
        <Text style={styles.subText}>Has terminado todas las tareas de este bloque</Text>
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={styles.homeButtonText}>Volver a Tareas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = getImageUrl(tareaObj.imagen);

  return (
    <View style={styles.container}>
      {/* Mostrar la imagen si existe */}
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.imagen}
          resizeMode="contain"
          onError={(e) => console.log('Error al cargar imagen:', e.nativeEvent.error)}
        />
      )}
      
      <Text style={styles.title}>{tareaObj.pregunta}</Text>

      {tareaObj.opciones?.map((opcion, index) => {
        const isSelected = selected === opcion;
        const isCorrect = opcion === tareaObj.respuestaCorrecta;

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
            disabled={respondido || loading}
            onPress={() => verificarRespuesta(opcion)}
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
            {correcta ? '¡Correcto! 🎉' : 'Incorrecto 😕'}
          </Text>
          {correcta && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                setSelected(null);
                setRespondido(false);
                setCorrecta(false);
                setMostrarRespuesta(false);
              }}
            >
              <Text style={styles.nextButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  imagen: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8B5CF6',
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#D8B878',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  feedbackText: {
    fontSize: 20,
    marginTop: 10,
    color: '#555',
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 15,
    color: '#8B5CF6',
  },
  finishedText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    color: '#4B3F2F',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});