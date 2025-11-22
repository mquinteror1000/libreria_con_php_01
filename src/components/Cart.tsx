import { useApp } from '../App';
import { Button } from './ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartProps {
  setCurrentPage: (page: any) => void;
}

export function Cart({ setCurrentPage }: CartProps) {
  const { cart, removeFromCart, updateCartQuantity, user } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    if (!user) {
      setCurrentPage('login');
    } else {
      setCurrentPage('checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-[#8B5F7D] mb-8 text-center">Carrito de Compras</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Button
            onClick={() => setCurrentPage('catalog')}
            className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
          >
            Ir al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[#8B5F7D] mb-8 text-center">Carrito de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.book.id} className="flex gap-4 border-2 border-[#00BCD4] rounded-lg p-4 bg-white">
              <img 
                src={item.book.image} 
                alt={item.book.title}
                className="w-24 h-32 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="text-[#8B5F7D] mb-1">{item.book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                <p className="text-[#8B5F7D]">${item.book.price}.00</p>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border-2 border-[#00BCD4] rounded">
                    <button
                      onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 border-x-2 border-[#00BCD4]">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity >= item.book.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.book.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[#8B5F7D]">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-2 border-[#00BCD4] rounded-lg p-6 bg-white sticky top-4">
            <h2 className="text-[#8B5F7D] mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-[#00BCD4] pt-3 flex justify-between">
                <span className="text-[#8B5F7D]">Total:</span>
                <span className="text-[#8B5F7D]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
            >
              Proceder al Pago
            </Button>
            
            <Button
              onClick={() => setCurrentPage('catalog')}
              variant="outline"
              className="w-full mt-2 border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4]/10"
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}