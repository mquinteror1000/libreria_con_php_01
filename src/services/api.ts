const API_BASE_URL = '/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  isbn: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  book_id: number;
  book: Book;
  quantity: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  book: Book;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string; is_admin?: boolean }) => {
    return apiCall<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { username: string; password: string }) => {
    return apiCall<{ message: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiCall<User[]>('/users');
  },

  getById: async (userId: number) => {
    return apiCall<User>(`/users/${userId}`);
  },

  update: async (userId: number, data: Partial<User>) => {
    return apiCall<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (userId: number) => {
    return apiCall<{ message: string }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Books API
export const booksAPI = {
  getAll: async () => {
    return apiCall<Book[]>('/books');
  },

  getById: async (bookId: number) => {
    return apiCall<Book>(`/books/${bookId}`);
  },

  create: async (data: Omit<Book, 'id' | 'created_at'>) => {
    return apiCall<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (bookId: number, data: Partial<Book>) => {
    return apiCall<Book>(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (bookId: number) => {
    return apiCall<{ message: string }>(`/books/${bookId}`, {
      method: 'DELETE',
    });
  },
};

// Cart API
export const cartAPI = {
  getCart: async (userId: number) => {
    return apiCall<CartItem[]>(`/cart/${userId}`);
  },

  addToCart: async (data: { user_id: number; book_id: number; quantity?: number }) => {
    return apiCall<CartItem>('/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCartItem: async (cartItemId: number, data: { quantity: number }) => {
    return apiCall<CartItem>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  removeFromCart: async (cartItemId: number) => {
    return apiCall<{ message: string }>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (userId: number) => {
    return apiCall<{ message: string }>(`/cart/user/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return apiCall<Order[]>('/orders');
  },

  getUserOrders: async (userId: number) => {
    return apiCall<Order[]>(`/orders/user/${userId}`);
  },

  getById: async (orderId: number) => {
    return apiCall<Order>(`/orders/${orderId}`);
  },

  create: async (data: {
    user_id: number;
    items: { book_id: number; quantity: number }[];
    total_amount: number;
    shipping_address: string;
  }) => {
    return apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (orderId: number, data: { status?: string; shipping_address?: string }) => {
    return apiCall<Order>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (orderId: number) => {
    return apiCall<{ message: string }>(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};

// Stats API
export const statsAPI = {
  getStats: async () => {
    return apiCall<{
      total_users: number;
      total_books: number;
      total_orders: number;
      total_revenue: number;
    }>('/stats');
  },
};
