import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F4F8' // Fondo más suave y menos saturado para reducir fatiga visual
    },
    
     scrollContent: {
        flexGrow: 1,
        paddingHorizontal: isSmallScreen ? 16 : 24, // Más espacio para reducir sobrecarga visual
        paddingTop: Platform.OS === 'ios' ? 60 : 50, // Más espacio superior
        paddingBottom: 50, // Más espacio inferior para evitar elementos cortados
      },

    input: {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 15,
    paddingVertical: 16, // Más altura para facilitar interacción
    marginBottom: 20, // Más separación entre elementos
    borderRadius: 12, // Bordes menos redondeados para mejor definición
    borderWidth: 2,
    borderColor: '#4A90A4', // Color con mejor contraste
    fontSize: 18, // Texto más grande para mejor legibilidad
    lineHeight: 24, // Espaciado entre líneas para facilitar lectura
    color: '#1A1A1A', // Negro más suave para reducir contraste extremo
    backgroundColor: '#FFFFFF', // Fondo blanco puro para máximo contraste
    letterSpacing: 0.5, // Espaciado entre letras para mejorar legibilidad
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18, // Más altura para área táctil más grande
    paddingHorizontal: 24, // Más ancho para mejor accesibilidad
    borderRadius: 12, // Bordes menos redondeados para mejor definición
    marginTop: 24, // Más separación
    marginBottom: 12, // Espacio inferior
    backgroundColor: '#2E86AB', // Color azul con mejor contraste y menos agresivo
    shadowColor: '#000000', // Sombra negra para mejor definición
    shadowOffset: { width: 0, height: 2 }, // Sombra más sutil
    shadowOpacity: 0.15, // Menos intensidad
    shadowRadius: 4,
    elevation: 3, // Elevación reducida
    minHeight: 54, // Altura mínima para accesibilidad táctil
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    paddingVertical: 20, // Espaciado vertical adicional
  },

 });