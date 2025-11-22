import { useApp } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Package, Mail } from 'lucide-react';
import { Badge } from './ui/badge';

export function Profile() {
  const { user, orders } = useApp();

  if (!user) return null;

  const userOrders = orders.filter(order => order.userId === user.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500">Pendiente</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Enviado</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Finalizado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'sent':
        return 'Enviado';
      case 'completed':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[#8B5F7D] mb-8 text-center">Mi Perfil</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Information */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-[#00BCD4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B5F7D]">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Correo
                </p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipo de cuenta</p>
                <p className="capitalize">{user.role === 'user' ? 'Usuario' : 'Administrador'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-[#00BCD4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B5F7D]">
                <Package className="w-5 h-5" />
                Historial de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>No tienes pedidos aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border-2 border-[#00BCD4] rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.book.title} x{item.quantity}
                            </span>
                            <span className="text-gray-700">
                              ${(item.book.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-[#8B5F7D]">Total:</span>
                        <span className="text-[#8B5F7D]">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
