import { useTheme } from "../context/ThemeContext";
import { EducationalContent } from "../types/menu";

export const useMenuData = () => {
  const { colors } = useTheme();

  const educationalContent: EducationalContent[] = [
    {
      title: "¡Aprende Jugando! 🎲",
      description: "Descubre cómo los números pueden ser divertidos. Aprenderás a contar, sumar y restar mientras te diviertes.",
      icon: "🎯",
      color: [colors.primary, colors.secondary],
      audioType: "learn"
    },
    {
      title: "Tu Amigo Digital 🤖",
      description: "Nuestro chatbot te ayudará en todo momento. Puedes preguntarle sobre matemáticas o pedirle ayuda cuando te sientas atascado.",
      icon: "🤖",
      color: [colors.secondary, colors.primary],
      audioType: "chatbot"
    },
    {
      title: "Gana Premios 🏆",
      description: "Cada vez que aprendas algo nuevo, ganarás estrellas y medallas. ¡Colecciona todas!",
      icon: "⭐",
      color: [colors.accent, colors.primary],
      audioType: "achievements"
    },
    {
      title: "A Tu Propio Ritmo 🐢",
      description: "No hay prisa. Aprende cuando quieras y vuelve a las lecciones las veces que necesites.",
      icon: "📚",
      color: [colors.secondary, colors.accent],
      audioType: "pace"
    }
  ];

  return {
    educationalContent
  };
};