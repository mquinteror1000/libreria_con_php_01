import { ShoppingCart, User, LogOut, Package, Users } from 'lucide-react';
import { useApp } from '../App';
import logo from '../assets/cabecera.png';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: any) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const { user, logout, cart } = useApp();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center mb-4">
          <img src={logo} alt="El nido literario" className="h-24 md:h-32 object-contain" />
        </div>
      </div>
      
      <div className="border-t-2 border-b-2 border-[#00BCD4] py-3">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 flex-wrap">
          {user?.role === 'admin' ? (
            <>
              <button
                onClick={() => setCurrentPage('admin-catalog')}
                className={`px-4 py-2 transition-colors rounded-md ${
                  currentPage === 'admin-catalog' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                Catálogo
              </button>
              <button
                onClick={() => setCurrentPage('admin-orders')}
                className={`px-4 py-2 transition-colors rounded-md flex items-center gap-2 ${
                  currentPage === 'admin-orders' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                <Package className="w-4 h-4" />
                Pedidos
              </button>
              <button
                onClick={() => setCurrentPage('admin-users')}
                className={`px-4 py-2 transition-colors rounded-md flex items-center gap-2 ${
                  currentPage === 'admin-users' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                <Users className="w-4 h-4" />
                Usuarios
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D] transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 transition-colors rounded-md ${
                  currentPage === 'home' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setCurrentPage('catalog')}
                className={`px-4 py-2 transition-colors rounded-md ${
                  currentPage === 'catalog' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                Catálogo
              </button>
              <button
                onClick={() => setCurrentPage('cart')}
                className={`px-4 py-2 transition-colors rounded-md flex items-center gap-2 relative ${
                  currentPage === 'cart' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Carrito
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00BCD4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className={`px-4 py-2 transition-colors rounded-md flex items-center gap-2 ${
                      currentPage === 'profile' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Perfil
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D] transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className={`px-4 py-2 transition-colors rounded-md ${
                    currentPage === 'login' ? 'text-white bg-[#8B5F7D]' : 'text-gray-700 hover:bg-[#E8B4D4] hover:text-[#8B5F7D]'
                  }`}
                >
                  Iniciar Sesión
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
