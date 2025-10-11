export interface Tarea {
  _id: string;
  pregunta: string;
  puntaje: number;
  dificultad?: string;
  opciones?: string[];
  respuestaCorrecta?: string;
  imagen?: string;
  bloque?: number;
}

export interface Progreso {
  _id: string;
  id_usuario: string;
  id_tarea: {
    _id: string;
    pregunta: string;
    puntaje: number;
    dificultad?: string;
  };
  fecha_completado: string;
  correcta: boolean;
}

export interface Logro {
  _id: string;
  logro: string;
  descripcion: string;
  icon: string;
  criterio: string;
  desbloqueado: boolean;
  fecha_desbloqueo?: string;
}