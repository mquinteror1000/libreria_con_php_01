import { useState } from 'react';
import { useApp, Order } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Package, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500">Pendiente</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Enviado</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Finalizado</Badge>;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'sent':
        return 'Enviado';
      case 'completed':
        return 'Finalizado';
    }
  };

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    sent: orders.filter(o => o.status === 'sent').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[#8B5F7D] mb-8 text-center">Gestión de Pedidos</h1>

      {/* Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-4 border-2 rounded-lg transition-all ${
            filterStatus === 'all' 
              ? 'border-[#00BCD4] bg-[#00BCD4]/10' 
              : 'border-gray-200 hover:border-[#00BCD4]'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Todos</p>
          <p className="text-[#8B5F7D]">{orderCounts.all}</p>
        </button>
        
        <button
          onClick={() => setFilterStatus('pending')}
          className={`p-4 border-2 rounded-lg transition-all ${
            filterStatus === 'pending' 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 hover:border-orange-500'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Pendientes</p>
          <p className="text-orange-600">{orderCounts.pending}</p>
        </button>
        
        <button
          onClick={() => setFilterStatus('sent')}
          className={`p-4 border-2 rounded-lg transition-all ${
            filterStatus === 'sent' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-500'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Enviados</p>
          <p className="text-blue-600">{orderCounts.sent}</p>
        </button>
        
        <button
          onClick={() => setFilterStatus('completed')}
          className={`p-4 border-2 rounded-lg transition-all ${
            filterStatus === 'completed' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-500'
          }`}
        >
          <p className="text-sm text-gray-600 mb-1">Finalizados</p>
          <p className="text-green-600">{orderCounts.completed}</p>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="border-2 border-[#00BCD4]">
            <CardContent className="py-12 text-center text-gray-600">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hay pedidos {filterStatus !== 'all' ? `en estado "${getStatusText(filterStatus as Order['status'])}"` : ''}</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="border-2 border-[#00BCD4]">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-[#8B5F7D] mb-2">
                      Pedido #{order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Cliente: {order.userName}</p>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(order.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(order.status)}
                    <p className="text-[#8B5F7D]">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="mb-3 text-gray-700">Productos:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                          <div className="flex-1">
                            <p className="text-gray-900">{item.book.title}</p>
                            <p className="text-gray-600 text-xs">{item.book.author}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-700">Cantidad: {item.quantity}</p>
                            <p className="text-gray-900">${(item.book.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="border-t pt-4">
                    <h4 className="mb-3 text-gray-700">Actualizar estado:</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                        disabled={order.status === 'pending'}
                        variant={order.status === 'pending' ? 'default' : 'outline'}
                        className={order.status === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500 text-orange-600 hover:bg-orange-50'}
                        size="sm"
                      >
                        Pendiente
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'sent')}
                        disabled={order.status === 'sent'}
                        variant={order.status === 'sent' ? 'default' : 'outline'}
                        className={order.status === 'sent' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}
                        size="sm"
                      >
                        Enviado
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        disabled={order.status === 'completed'}
                        variant={order.status === 'completed' ? 'default' : 'outline'}
                        className={order.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : 'border-green-500 text-green-600 hover:bg-green-50'}
                        size="sm"
                      >
                        Finalizado
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
