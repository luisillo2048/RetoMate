import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image,Linking} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../themes/GameStyles';

const MathGamesScreen = () => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('sumas');

  // Tipos de ejercicios
  const categories = [
    { id: 'sumas', name: 'Sumas', icon: 'plus-circle' },
    { id: 'restas', name: 'Restas', icon: 'minus-circle' },
    { id: 'figuras', name: 'Figuras', icon: 'shape' },
    { id: 'numeros', name: 'Números', icon: 'numeric' }
  ];

  // Ejercicios por categoría
  const exercises = {
    sumas: [
      { 
        title: 'Suma con Dibujos', 
        description: 'Cuenta los animalitos y suma', 
        image: require('../../assets/images/sumas-dibujos.png'),
        link: 'https://www.mathgames.com/suma-dibujos'
      },
      { 
        title: 'Suma Rápida', 
        description: 'Resuelve antes que se acabe el tiempo', 
        image: require('../../assets/images/suma-rapida..png'),
        link: 'https://www.mathgames.com/suma-rapida'
      }
    ],
    restas: [
      // ... ejercicios de resta
    ],
    figuras: [
      // ... ejercicios de figuras
    ],
    numeros: [
      // ... ejercicios de números
    ]
  };

  // Recursos adicionales
  const learningResources = [
    {
      title: 'Aprende a Contar',
      source: 'Educapeques',
      link: 'https://www.educapeques.com/contar'
    },
    {
      title: 'Canciones de Números',
      source: 'Youtube',
      link: 'https://youtube.com/canciones-numeros'
    },
    {
      title: 'Juegos Matemáticos',
      source: 'PBS Kids',
      link: 'https://pbskids.org/math-games'
    }
  ];

  const openLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error("Error al abrir el enlace:", err);
      alert('No se pudo abrir el enlace');
    });
  };

  return (
    <LinearGradient
      colors={['#6DD5FA', '#FF6B6B']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="math-compass" 
            size={40} 
            color="#FFF" 
          />
          <Text style={styles.title}>Aventura Matemática</Text>
          <Text style={styles.subtitle}>¡Aprende jugando!</Text>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.categoryButton,
                activeCategory === cat.id && styles.activeCategory
              ]}
            >
              <MaterialCommunityIcons 
                name={cat.icon} 
                size={28} 
                color={activeCategory === cat.id ? '#FF758C' : '#FFF'} 
              />
              <Text style={[
                styles.categoryText,
                activeCategory === cat.id && styles.activeCategoryText
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ejercicios */}
        <Text style={styles.sectionTitle}>Ejercicios de {categories.find(c => c.id === activeCategory)?.name}</Text>
        
        {exercises[activeCategory]?.map((exercise, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.exerciseCard}
            onPress={() => openLink(exercise.link)}
          >
            <Image source={exercise.image} style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDesc}>{exercise.description}</Text>
              <View style={styles.playButton}>
                <Text style={styles.playText}>JUGAR</Text>
                <Ionicons name="play-circle" size={20} color="#FF758C" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Recursos Adicionales */}
        <Text style={styles.sectionTitle}>Más para Aprender</Text>
        
        {learningResources.map((resource, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resourceCard}
            onPress={() => openLink(resource.link)}
          >
            <View style={styles.resourceIcon}>
              <Ionicons name="link" size={20} color="#6DD5FA" />
            </View>
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSource}>{resource.source}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}

        {/* Botón de refuerzo */}
        <TouchableOpacity 
          style={styles.reinforceButton}
          onPress={() => navigation.navigate('Practice')}
        >
          <LinearGradient
            colors={['#FF758C', '#FF7EB3']}
            style={styles.gradientButton}
          >
            <Text style={styles.reinforceText}>Reforzar Conocimientos</Text>
            <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};


export default MathGamesScreen;