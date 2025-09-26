import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  grado: string,
  codigo_maestro: string
) => {
  const response = await axios.post(`${apiUrl}/auth/register`, {
    username,
    email,
    password,
    grado,
    codigo_maestro,
  });
  return response.data;
};