# Guía de Integración: Frontend con Backend

Esta guía te ayudará a conectar el frontend React (que actualmente usa estado local) con el backend PHP y MySQL.

## Estado Actual

El archivo `src/App.tsx` actualmente:
- Gestiona todo el estado en memoria usando React hooks
- No persiste datos (se pierden al recargar)
- Tiene usuarios y libros hardcodeados

El archivo `src/services/api.ts` ya tiene todos los métodos para conectarse al backend, pero **NO se están usando**.

## Opción 1: Migración Completa (Recomendado)

### Paso 1: Crear un nuevo AppProvider

Crea `src/contexts/AppContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { booksAPI, cartAPI, ordersAPI, usersAPI } from '../services/api';

// Importa las interfaces desde App.tsx o crea un archivo types.ts
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  isbn: string;
}

interface CartItem {
  id: number;
  user_id: number;
  book_id: number;
  book: Book;
  quantity: number;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  items: any[];
}

interface AppContextType {
  books: Book[];
  cart: CartItem[];
  orders: Order[];
  loadBooks: () => Promise<void>;
  loadCart: () => Promise<void>;
  loadOrders: () => Promise<void>;
  addToCart: (bookId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  createOrder: (items: any[], totalAmount: number, shippingAddress: string) => Promise<void>;
  // ... más funciones según necesites
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadBooks = async () => {
    try {
      const data = await booksAPI.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadCart = async () => {
    if (!user) return;
    try {
      const data = await cartAPI.getCart(user.id);
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    try {
      const data = await ordersAPI.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const addToCart = async (bookId: number, quantity: number = 1) => {
    if (!user) return;
    try {
      await cartAPI.addToCart({
        user_id: user.id,
        book_id: bookId,
        quantity
      });
      await loadCart(); // Recargar el carrito
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const createOrder = async (items: any[], totalAmount: number, shippingAddress: string) => {
    if (!user) return;
    try {
      await ordersAPI.create({
        user_id: user.id,
        items,
        total_amount: totalAmount,
        shipping_address: shippingAddress
      });
      await cartAPI.clearCart(user.id);
      await loadCart();
      await loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // Cargar datos al montar y cuando cambia el usuario
  useEffect(() => {
    loadBooks();
    if (user) {
      loadCart();
      loadOrders();
    }
  }, [user]);

  const value = {
    books,
    cart,
    orders,
    loadBooks,
    loadCart,
    loadOrders,
    addToCart,
    removeFromCart,
    createOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

### Paso 2: Modificar main.tsx

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
);
```

### Paso 3: Simplificar App.tsx

Ahora `App.tsx` solo maneja el routing/navegación:

```typescript
import { useState } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
// ... otros imports
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register' | ...>('home');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="top-right" richColors />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-1">
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'register' && <Register setCurrentPage={setCurrentPage} />}
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {/* ... resto de las páginas */}
      </main>

      <Footer />
    </div>
  );
}
```

### Paso 4: Actualizar Componentes

En cada componente que necesite datos, usa los hooks:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export function Catalog() {
  const { user } = useAuth();
  const { books, addToCart } = useApp();

  const handleAddToCart = async (bookId: number) => {
    if (!user) {
      // Mostrar mensaje o redirigir al login
      return;
    }
    await addToCart(bookId, 1);
  };

  return (
    <div>
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onAddToCart={() => handleAddToCart(book.id)}
        />
      ))}
    </div>
  );
}
```

## Opción 2: Migración Gradual

Si prefieres migrar gradualmente, puedes mantener el `App.tsx` actual pero modificar las funciones para usar la API:

### Ejemplo: Migrar la función login

```typescript
// Antes (estado local)
const login = (email: string, password: string): boolean => {
  const foundUser = users.find(u => u.email === email && u.password === password);
  if (foundUser) {
    setUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role });
    setCurrentPage(foundUser.role === 'admin' ? 'admin-catalog' : 'home');
    return true;
  }
  return false;
};

// Después (con API)
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await authAPI.login({ username: email, password });
    setUser({
      id: response.user.id,
      name: response.user.username,
      email: response.user.email,
      role: response.user.is_admin ? 'admin' : 'user'
    });
    setCurrentPage(response.user.is_admin ? 'admin-catalog' : 'home');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### Ejemplo: Migrar addBook

```typescript
// Antes
const addBook = (book: Omit<Book, 'id'>) => {
  const newBook: Book = { id: books.length + 1, ...book };
  setBooks([...books, newBook]);
};

// Después
const addBook = async (book: Omit<Book, 'id'>) => {
  try {
    const newBook = await booksAPI.create({
      title: book.title,
      author: book.author,
      year: book.year,
      description: book.synopsis, // Nota: cambio de nombre
      price: book.price,
      stock: book.stock,
      image_url: book.image, // Nota: cambio de nombre
      category: '',
      isbn: ''
    });

    // Mapear la respuesta al formato del frontend
    const frontendBook: Book = {
      id: newBook.id,
      title: newBook.title,
      author: newBook.author,
      year: newBook.year,
      synopsis: newBook.description,
      price: newBook.price,
      stock: newBook.stock,
      image: newBook.image_url
    };

    setBooks([...books, frontendBook]);
  } catch (error) {
    console.error('Error adding book:', error);
    // Mostrar error al usuario
  }
};
```

## Diferencias de Esquema

Ten en cuenta estas diferencias entre el frontend y el backend:

| Frontend | Backend |
|----------|---------|
| `synopsis` | `description` |
| `image` | `image_url` |
| `name` | `username` |
| `role: 'admin' \| 'user'` | `is_admin: boolean` |

Necesitarás funciones helper para mapear entre estos formatos:

```typescript
// helpers/mappers.ts
export const mapBookFromAPI = (apiBook: any): Book => ({
  id: apiBook.id,
  title: apiBook.title,
  author: apiBook.author,
  year: apiBook.year,
  synopsis: apiBook.description,
  price: apiBook.price,
  stock: apiBook.stock,
  image: apiBook.image_url
});

export const mapBookToAPI = (book: Omit<Book, 'id'>): any => ({
  title: book.title,
  author: book.author,
  year: book.year,
  description: book.synopsis,
  price: book.price,
  stock: book.stock,
  image_url: book.image,
  category: '',
  isbn: ''
});
```

## Manejo de Errores

Implementa manejo de errores robusto:

```typescript
import { toast } from 'sonner';

const loadBooks = async () => {
  try {
    const data = await booksAPI.getAll();
    setBooks(data.map(mapBookFromAPI));
  } catch (error) {
    toast.error('Error al cargar los libros');
    console.error('Error loading books:', error);
  }
};
```

## Autenticación Persistente

El `AuthContext` ya guarda el usuario en `localStorage`. Asegúrate de:

1. Guardar el usuario al hacer login
2. Cargar el usuario al iniciar la app
3. Limpiar el usuario al hacer logout

```typescript
// Ya implementado en src/contexts/AuthContext.tsx
useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);
```

## Testing

Prueba cada endpoint con curl o Postman:

```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test get books
curl http://localhost:8000/api/books

# Test add to cart
curl -X POST http://localhost:8000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"book_id":1,"quantity":2}'
```

## Próximos Pasos

1. Decide qué opción de migración usar (completa o gradual)
2. Implementa los cambios paso a paso
3. Prueba cada funcionalidad después de migrarla
4. Implementa manejo de errores y loading states
5. Agrega validaciones del lado del cliente

## Recursos

- Documentación de la API: Ver `README.md` sección "API Endpoints"
- Código de referencia: `src/services/api.ts`
- Contexto de autenticación: `src/contexts/AuthContext.tsx`
