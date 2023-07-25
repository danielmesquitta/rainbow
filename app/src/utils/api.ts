import axios from 'axios';

console.log(`${import.meta.env.VITE_API_URL}/docs`);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
