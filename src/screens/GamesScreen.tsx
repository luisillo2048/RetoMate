import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image,Linking} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
      colors={['#6DD5FA', '#FF758C']}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    fontFamily: 'ComicNeue-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    width: '23%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeCategory: {
    backgroundColor: '#FFF',
  },
  categoryText: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: '#FF758C',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    height: 120,
    elevation: 3,
  },
  exerciseImage: {
    width: '40%',
    height: '100%',
  },
  exerciseInfo: {
    padding: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  exerciseDesc: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  playText: {
    color: '#FF758C',
    fontWeight: 'bold',
    marginRight: 5,
  },
  resourceCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    backgroundColor: 'rgba(109,213,250,0.2)',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  resourceSource: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  reinforceButton: {
    marginTop: 25,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reinforceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default MathGamesScreen;