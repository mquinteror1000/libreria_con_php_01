import { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, CreditCard, MapPin, User } from 'lucide-react';

interface CheckoutProps {
  setCurrentPage: (page: any) => void;
}

export function Checkout({ setCurrentPage }: CheckoutProps) {
  const { cart, clearCart, createOrder, user } = useApp();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear la orden
    createOrder(cart, total);
    
    // Limpiar el carrito
    clearCart();
    
    // Mostrar pantalla de éxito
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-2 border-green-500">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-[#8B5F7D] mb-4">¡Pedido Realizado con Éxito!</h1>
            <p className="text-gray-600 mb-6">
              Gracias por tu compra. Recibirás un correo de confirmación en breve.
            </p>
            <div className="bg-[#E8B4D4]/30 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <p className="mb-2">Total pagado: <span className="text-[#8B5F7D]">${total.toFixed(2)}</span></p>
              <p className="text-sm text-gray-600">Tu pedido será procesado en las próximas 24-48 horas</p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setCurrentPage('profile')}
                className="bg-[#8B5F7D] hover:bg-[#7A4E6C] text-white"
              >
                Ver Mis Pedidos
              </Button>
              <Button
                onClick={() => setCurrentPage('catalog')}
                variant="outline"
                className="border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4]/10"
              >
                Seguir Comprando
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[#8B5F7D] mb-8 text-center">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de Contacto */}
            <Card className="border-2 border-[#00BCD4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8B5F7D]">
                  <User className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="border-[#00BCD4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-[#00BCD4]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-[#00BCD4]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dirección de Envío */}
            <Card className="border-2 border-[#00BCD4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8B5F7D]">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="border-[#00BCD4]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="border-[#00BCD4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="border-[#00BCD4]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Pago */}
            <Card className="border-2 border-[#00BCD4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8B5F7D]">
                  <CreditCard className="w-5 h-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={19}
                    className="border-[#00BCD4]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la tarjeta *</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    className="border-[#00BCD4]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Fecha de expiración *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      maxLength={5}
                      className="border-[#00BCD4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      maxLength={4}
                      className="border-[#00BCD4]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#00BCD4] sticky top-4">
              <CardHeader>
                <CardTitle className="text-[#8B5F7D]">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.book.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.book.title} x{item.quantity}
                      </span>
                      <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-[#00BCD4] pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Envío:</span>
                    <span>GRATIS</span>
                  </div>
                  <div className="border-t-2 border-[#00BCD4] pt-2 flex justify-between">
                    <span className="text-[#8B5F7D]">Total:</span>
                    <span className="text-[#8B5F7D]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                >
                  Confirmar Pago
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setCurrentPage('cart')}
                  variant="outline"
                  className="w-full border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4]/10"
                >
                  Volver al Carrito
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}