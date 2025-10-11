export interface Logro {
  _id: string;
  logro: string;
  descripcion: string;
  icon: string;
  tipo: 'tareas_completadas' | 'puntaje' | 'bloque';
  meta: number;
  bloque?: number;
  desbloqueado?: boolean;
  fecha_desbloqueo?: string;
  progreso_actual?: number;
  porcentaje?: number;
}

export interface Estadisticas {
  tareas_completadas: number;
  puntaje_total: number;
  bloques_completados: number[];
  racha_actual: number;
}