import * as Speech from 'expo-speech';
import { Tarea } from '../types';

let isSpeaking = false;
let currentSpeechQueue: string[] = [];

export const leerTexto = (texto: string) => {
  if (isSpeaking) {
    Speech.stop();
    isSpeaking = false;
  }
  
  return new Promise<void>((resolve) => {
    Speech.speak(texto, {
      language: 'es-ES',
      rate: 0.9, // Velocidad ligeramente reducida
      onStart: () => { isSpeaking = true; },
      onDone: () => { 
        isSpeaking = false; 
        resolve();
      },
      onStopped: () => { 
        isSpeaking = false; 
        resolve();
      },
    });
  });
};

export const leerPregunta = async (tareaActual: Tarea) => {
  if (!tareaActual) return;
  
  if (isSpeaking) {
    Speech.stop();
    isSpeaking = false;
  }

  await leerTexto(tareaActual.pregunta);
};

export const leerOpciones = async (tareaActual: Tarea) => {
  if (!tareaActual?.opciones) return;
  
  if (isSpeaking) {
    Speech.stop();
    isSpeaking = false;
  }

  for (let i = 0; i < tareaActual.opciones.length; i++) {
    await leerTexto(`Opción ${i + 1}: ${tareaActual.opciones[i]}`);
    // Pequeña pausa entre opciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

export const stopSpeech = () => {
  if (isSpeaking) {
    Speech.stop();
    isSpeaking = false;
  }
  currentSpeechQueue = [];
};

export const getIsSpeaking = () => isSpeaking;