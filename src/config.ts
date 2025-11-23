// Configuración de la aplicación
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/api/auth/login`,
      register: `${API_URL}/api/auth/register`,
    },
    books: `${API_URL}/api/books`,
    cart: `${API_URL}/api/cart`,
    orders: `${API_URL}/api/orders`,
    users: `${API_URL}/api/users`,
  }
};
