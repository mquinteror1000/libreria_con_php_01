import { useApp } from '../App';
import { User, Mail, Shield, UserCircle } from 'lucide-react';

export function AdminUsers() {
  const { users } = useApp();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-[#8B5F7D] mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Información de todos los usuarios registrados en El Nido Literario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#8B5F7D] to-[#6d4a63] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Total Usuarios</p>
              <p className="text-3xl">{users.length}</p>
            </div>
            <User className="w-12 h-12 text-white/70" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00BCD4] to-[#00ACC1] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Usuarios Regulares</p>
              <p className="text-3xl">{users.filter(u => u.role === 'user').length}</p>
            </div>
            <UserCircle className="w-12 h-12 text-white/70" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#E8B4D4] to-[#d99bc2] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Administradores</p>
              <p className="text-3xl">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <Shield className="w-12 h-12 text-white/70" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-[#00BCD4]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#8B5F7D] text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Rol</th>
                <th className="px-6 py-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-[#E8B4D4]/20 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="text-gray-900">#{user.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8B5F7D] text-white flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-[#00BCD4]" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5F7D] text-white">
                        <Shield className="w-4 h-4" />
                        Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00BCD4] text-white">
                        <UserCircle className="w-4 h-4" />
                        Usuario
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
}
