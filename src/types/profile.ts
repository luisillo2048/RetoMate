export interface User {
  id: string;
  username: string;
  email: string;
  grado?: string;
}

export interface ProgressItem {
  id: string;
  puntaje: number;
}

export interface ProgressSummary {
  totalPuntaje: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string[];
  text: string;
}

export interface AuthContextType {
  user: User | null;
}

export interface ThemeContextType {
  theme: string;
  colors: ThemeColors;
}