import { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface LoginProps {
  setCurrentPage: (page: any) => void;
}

export function Login({ setCurrentPage }: LoginProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-2 border-[#00BCD4]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#8B5F7D]">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#00BCD4] focus:ring-[#8B5F7D]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#00BCD4] focus:ring-[#8B5F7D]"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="mb-2">Cuentas de prueba:</p>
              <p><strong>Usuario:</strong> usuario@demo.com / demo123</p>
              <p><strong>Admin:</strong> admin@nidoliterario.com / admin123</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
            >
              Iniciar Sesión
            </Button>
            
            <div className="text-center text-sm">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('register')}
                className="text-[#8B5F7D] hover:underline"
              >
                Regístrate aquí
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
