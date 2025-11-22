import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Catalog } from './components/Catalog';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Profile } from './components/Profile';
import { AdminCatalog } from './components/AdminCatalog';
import { AdminOrders } from './components/AdminOrders';
import { AdminUsers } from './components/AdminUsers';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster, toast } from 'sonner';

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  synopsis: string;
  price: number;
  stock: number;
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'sent' | 'completed';
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: number, updates: Partial<Book>) => void;
  deleteBook: (id: number) => void;
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateCartQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (items: CartItem[], total: number) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => Promise<void>;
  users: User[];
  addUser: (name: string, email: string, password: string) => boolean;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const initialBooks: Book[] = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    year: 1967,
    synopsis: "Narra el ascenso y la caída de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo, explorando temas como el incesto, el mito, la historia y la soledad, en una de las obras cumbres del realismo mágico.",
    price: 300,
    stock: 3,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
  },
  {
    id: 2,
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    year: 1605,
    synopsis: "Alonso Quijano, un hidalgo cincuentón, enloquece leyendo libros de caballerías y decide convertirse en el caballero andante Don Quijote, acompañado de su escudero Sancho Panza, para 'desfacer entuertos' y buscar la gloria. Es considerada la primera novela moderna.",
    price: 450,
    stock: 7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    synopsis: "En un futuro distópico, la sociedad es controlada por un régimen totalitario liderado por el omnipresente 'Gran Hermano'. Winston Smith, un empleado del Ministerio de la Verdad, intenta rebelarse contra el sistema y su control absoluto sobre el pensamiento.",
    price: 250,
    stock: 15,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Crimen y castigo",
    author: "Fiódor Dostoyevski",
    year: 1866,
    synopsis: "El estudiante Rodión Raskólnikov asesina a una vieja usurera en San Petersburgo para demostrar una teoría sobre la moralidad y la existencia de hombres 'extraordinarios'. La novela explora su tormento psicológico, su culpa y su camino hacia la redención.",
    price: 250,
    stock: 2,
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop"
  },
  {
    id: 5,
    title: "Orgullo y prejuicio",
    author: "Jane Austen",
    year: 1813,
    synopsis: "Ambientada en la Inglaterra rural, sigue la vida de las cinco hermanas Bennet, centrándose en la relación entre la vivaz e inteligente Elizabeth Bennet y el orgulloso señor Darcy. Es una sátira social sobre las costumbres, el matrimonio y la moral de la época.",
    price: 150,
    stock: 10,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
  },
  {
    id: 6,
    title: "El señor de los anillos",
    author: "J. R. R. Tolkien",
    year: 1954,
    synopsis: "En la Tierra Media, el hobbit Frodo Bolsón hereda un artefacto de inmenso poder maligno. Junto a una comunidad de compañeros, emprende una épica misión para destruirlo en el Monte del Destino y salvar al mundo de la oscuridad de Sauron.",
    price: 500,
    stock: 8,
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop"
  },
  {
    id: 7,
    title: "El extranjero",
    author: "Albert Camus",
    year: 1942,
    synopsis: "Meursault, en la primera persona por Meursault, un hombre de origen francés que vive en Argelia. Tras el funeral de su madre, se ve involucrado en un acto de violencia sin sentido que lo lleva a cuestionar la existencia y la indiferencia del universo. Es una obra clave del existencialismo.",
    price: 320,
    stock: 4,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop"
  },
  {
    id: 8,
    title: "Matar un ruiseñor",
    author: "Harper Lee",
    year: 1960,
    synopsis: "En la Alabama de los años 30, la joven Scout Finch narra la historia de su padre, el abogado Atticus Finch, quien defiende a un hombre negro acusado injustamente de violación, explorando temas de racismo, injusticia y pérdida de la inocencia.",
    price: 280,
    stock: 12,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop"
  }
];

const initialUsers = [
  { id: 1, name: 'Admin', email: 'admin@nidoliterario.com', password: 'admin123', role: 'admin' as const },
  { id: 2, name: 'Usuario Demo', email: 'usuario@demo.com', password: 'demo123', role: 'user' as const }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(initialUsers);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register' | 'catalog' | 'cart' | 'checkout' | 'profile' | 'admin-catalog' | 'admin-orders' | 'admin-users'>('home');

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Cargar carrito cuando el usuario cambie (login/logout)
  useEffect(() => {
    const loadUserCart = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:8000/api/cart/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            const cartItems: CartItem[] = data.map((item: any) => ({
              book: {
                id: item.book.id,
                title: item.book.title,
                author: item.book.author,
                year: item.book.year,
                synopsis: item.book.description,
                price: parseFloat(item.book.price),
                stock: item.book.stock,
                image: item.book.image_url
              },
              quantity: item.quantity
            }));
            setCart(cartItems);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      } else {
        setCart([]);
      }
    };

    loadUserCart();
  }, [user]);

  // Cargar libros desde la base de datos
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/books');
        if (response.ok) {
          const data = await response.json();
          const booksFromDB: Book[] = data.map((book: any) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year,
            synopsis: book.description,
            price: parseFloat(book.price),
            stock: book.stock,
            image: book.image_url
          }));
          setBooks(booksFromDB);
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    loadBooks();
  }, []);

  // Cargar usuarios desde la base de datos
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users');
        if (response.ok) {
          const data = await response.json();
          const usersFromDB: User[] = data.map((u: any) => ({
            id: u.id,
            name: u.username,
            email: u.email,
            role: u.is_admin ? 'admin' : 'user'
          }));
          setUsers(usersFromDB);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, []);

  // Cargar pedidos desde la base de datos
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/orders');
        if (response.ok) {
          const data = await response.json();
          const ordersFromDB: Order[] = data.map((order: any) => ({
            id: order.id,
            userId: order.user_id,
            userName: order.username,
            items: order.items.map((item: any) => ({
              book: {
                id: item.book_id,
                title: item.title,
                author: item.author,
                year: 0,
                synopsis: '',
                price: parseFloat(item.price),
                stock: 0,
                image: item.image_url
              },
              quantity: item.quantity
            })),
            total: parseFloat(order.total_amount),
            date: new Date(order.created_at),
            status: order.status,
            shippingAddress: order.shipping_address
          }));
          setOrders(ordersFromDB);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // El backend espera 'username'
          password: password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Credenciales inválidas', {
          duration: 3000,
        });
        return false;
      }

      const data = await response.json();

      // Mapear el usuario del backend al formato del frontend
      const loggedUser: User = {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.is_admin ? 'admin' : 'user'
      };

      setUser(loggedUser);

      // Redirigir al administrador al catálogo y a usuarios normales al inicio
      setCurrentPage(loggedUser.role === 'admin' ? 'admin-catalog' : 'home');

      toast.success(`¡Bienvenido ${loggedUser.name}!`, {
        duration: 2000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error al iniciar sesión. Por favor intenta de nuevo.', {
        duration: 3000,
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          is_admin: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Error al registrar usuario', {
          duration: 3000,
        });
        return false;
      }

      const data = await response.json();

      // Mapear el usuario del backend al formato del frontend
      const newUser: User = {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.is_admin ? 'admin' : 'user'
      };

      setUser(newUser);
      setCurrentPage('home');

      toast.success('¡Registro exitoso! Bienvenido a El Nido Literario', {
        duration: 3000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });

      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Error al registrar. Por favor intenta de nuevo.', {
        duration: 3000,
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCurrentPage('home');
  };

  const addBook = async (book: Omit<Book, 'id'>) => {
    try {
      const response = await fetch('http://localhost:8000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          year: book.year,
          description: book.synopsis,
          price: book.price,
          stock: book.stock,
          image_url: book.image,
          category: 'General',
          isbn: ''
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar el libro');
      }

      const data = await response.json();

      // Crear el libro con el ID retornado por la API
      const newBook: Book = {
        id: data.id,
        title: book.title,
        author: book.author,
        year: book.year,
        synopsis: book.synopsis,
        price: book.price,
        stock: book.stock,
        image: book.image
      };

      setBooks([...books, newBook]);

      toast.success('Libro agregado exitosamente a la base de datos!', {
        duration: 3000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error al agregar el libro. Por favor intenta de nuevo.', {
        duration: 3000,
      });
    }
  };

  const updateBook = async (id: number, updates: Partial<Book>) => {
    try {
      const bookToUpdate = books.find(b => b.id === id);
      if (!bookToUpdate) return;

      const response = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updates.title || bookToUpdate.title,
          author: updates.author || bookToUpdate.author,
          year: updates.year || bookToUpdate.year,
          description: updates.synopsis || bookToUpdate.synopsis,
          price: updates.price || bookToUpdate.price,
          stock: updates.stock || bookToUpdate.stock,
          image_url: updates.image || bookToUpdate.image,
          category: 'General',
          isbn: ''
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el libro');
      }

      setBooks(books.map(book => book.id === id ? { ...book, ...updates } : book));

      toast.success('Libro actualizado en la base de datos!', {
        duration: 2000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error al actualizar el libro.', {
        duration: 3000,
      });
    }
  };

  const deleteBook = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el libro');
      }

      setBooks(books.filter(book => book.id !== id));

      toast.success('Libro eliminado de la base de datos!', {
        duration: 2000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error al eliminar el libro.', {
        duration: 3000,
      });
    }
  };

  const loadCart = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:8000/api/cart/${user.id}`);
      if (!response.ok) {
        throw new Error('Error al cargar el carrito');
      }

      const data = await response.json();

      // Mapear los datos del backend al formato del frontend
      const cartItems: CartItem[] = data.map((item: any) => ({
        book: {
          id: item.book.id,
          title: item.book.title,
          author: item.book.author,
          year: item.book.year,
          synopsis: item.book.description,
          price: parseFloat(item.book.price),
          stock: item.book.stock,
          image: item.book.image_url
        },
        quantity: item.quantity
      }));

      setCart(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (book: Book) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar al carrito', {
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book.id,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }

      // Actualizar estado local
      const existingItem = cart.find(item => item.book.id === book.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast.success(`Se agregó otra unidad de "${book.title}"`, {
          duration: 2000,
          style: {
            background: '#8B5F7D',
            color: 'white',
            border: '2px solid #00BCD4'
          }
        });
      } else {
        setCart([...cart, { book, quantity: 1 }]);
        toast.success(`"${book.title}" agregado al carrito`, {
          duration: 2000,
          style: {
            background: '#8B5F7D',
            color: 'white',
            border: '2px solid #00BCD4'
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito', {
        duration: 3000,
      });
    }
  };

  const removeFromCart = async (bookId: number) => {
    if (!user) return;

    try {
      // Encontrar el item en el carrito para obtener su ID en la BD
      const cartItem = cart.find(item => item.book.id === bookId);
      if (!cartItem) return;

      // Necesitamos obtener el cart_item_id del backend
      const cartResponse = await fetch(`http://localhost:8000/api/cart/${user.id}`);
      const cartData = await cartResponse.json();
      const backendItem = cartData.find((item: any) => item.book.id === bookId);

      if (backendItem) {
        const response = await fetch(`http://localhost:8000/api/cart/${backendItem.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar del carrito');
        }
      }

      setCart(cart.filter(item => item.book.id !== bookId));

      toast.success('Producto eliminado del carrito', {
        duration: 2000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar del carrito', {
        duration: 3000,
      });
    }
  };

  const updateCartQuantity = async (bookId: number, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    try {
      // Obtener el cart_item_id del backend
      const cartResponse = await fetch(`http://localhost:8000/api/cart/${user.id}`);
      const cartData = await cartResponse.json();
      const backendItem = cartData.find((item: any) => item.book.id === bookId);

      if (backendItem) {
        const response = await fetch(`http://localhost:8000/api/cart/${backendItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
          throw new Error('Error al actualizar cantidad');
        }
      }

      setCart(cart.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Error al actualizar cantidad', {
        duration: 3000,
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:8000/api/cart/user/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al limpiar el carrito');
      }

      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error al limpiar el carrito', {
        duration: 3000,
      });
    }
  };

  const createOrder = async (items: CartItem[], total: number) => {
    if (!user) return;

    try {
      // Crear orden en el backend
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          items: items.map(item => ({
            book_id: item.book.id,
            quantity: item.quantity,
            price: item.book.price
          })),
          total_amount: total,
          shipping_address: 'Dirección por defecto' // Puedes hacer esto dinámico
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la orden');
      }

      const data = await response.json();

      // Actualizar estado local
      const newOrder: Order = {
        id: data.id,
        userId: user.id,
        userName: user.name,
        items: items.map(item => ({
          book: { ...item.book },
          quantity: item.quantity
        })),
        total,
        date: new Date().toISOString(),
        status: 'pending'
      };

      setOrders([...orders, newOrder]);

      // Update stock locally
      items.forEach(item => {
        updateBook(item.book.id, { stock: item.book.stock - item.quantity });
      });

      toast.success('Orden creada exitosamente y guardada en la base de datos!', {
        duration: 3000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al crear la orden. Por favor intenta de nuevo.', {
        duration: 3000,
      });
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        toast.error('Error al actualizar el estado del pedido', {
          duration: 3000,
        });
        return;
      }

      // Actualizar el estado local solo si la API respondió exitosamente
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));

      toast.success('Estado del pedido actualizado correctamente', {
        duration: 3000,
        style: {
          background: '#8B5F7D',
          color: 'white',
          border: '2px solid #00BCD4'
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado del pedido', {
        duration: 3000,
      });
    }
  };

  const addUser = (name: string, email: string, password: string): boolean => {
    if (users.some(u => u.email === email)) {
      return false;
    }
    const newUser = { id: users.length + 1, name, email, password, role: 'user' as const };
    setUsers([...users, newUser]);
    return true;
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const contextValue: AppContextType = {
    user,
    login,
    register,
    logout,
    books,
    addBook,
    updateBook,
    deleteBook,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    orders,
    createOrder,
    updateOrderStatus,
    users,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-white">
        <Toaster position="top-right" richColors />
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <main className="flex-1">
          {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === 'register' && <Register setCurrentPage={setCurrentPage} />}
          {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'catalog' && <Catalog />}
          {currentPage === 'cart' && <Cart setCurrentPage={setCurrentPage} />}
          {currentPage === 'checkout' && <Checkout setCurrentPage={setCurrentPage} />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'admin-catalog' && user?.role === 'admin' && <AdminCatalog />}
          {currentPage === 'admin-orders' && user?.role === 'admin' && <AdminOrders />}
          {currentPage === 'admin-users' && user?.role === 'admin' && <AdminUsers />}
        </main>

        <Footer />
      </div>
    </AppContext.Provider>
  );
}