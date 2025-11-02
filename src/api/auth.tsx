import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.API_URL;

if (!apiUrl) {
  console.warn(
    "⚠️ La URL de la API no está definida. Revisa tu .env y app.config.js"
  );
}

// Configuración base de axios
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

// --- Login ---
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    console.error("Error loginUser full:", error.response || error.message);
    throw error.response?.data || error;
  }
};

// --- Registro ---
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  grado?: string,
  codigo_maestro?: string
) => {
  try {
    // Validación simple de 'grado'
    const gradosPermitidos = ["1A°", "1B°", "1C°"];
    if (grado && !gradosPermitidos.includes(grado)) {
      throw new Error(
        `Grado inválido. Debe ser uno de: ${gradosPermitidos.join(", ")}`
      );
    }

    // Payload: enviamos solo campos que existen
    const payload: any = { username, email, password };
    if (grado) payload.grado = grado;
    if (codigo_maestro) payload.codigo_maestro = codigo_maestro;

    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error registerUser full:", error.response || error.message);
    throw error.response?.data || error;
  }
};
