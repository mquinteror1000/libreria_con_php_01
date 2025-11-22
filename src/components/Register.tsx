import { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface RegisterProps {
  setCurrentPage: (page: any) => void;
}

export function Register({ setCurrentPage }: RegisterProps) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    await register(name, email, password);
    // Error handling is done by the register function via toast notifications
  };

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-2 border-[#00BCD4]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[#8B5F7D]">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para empezar a comprar tus libros favoritos
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
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#00BCD4] focus:ring-[#8B5F7D]"
              />
            </div>
            
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-[#00BCD4] focus:ring-[#8B5F7D]"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
            >
              Registrarse
            </Button>
            
            <div className="text-center text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-[#8B5F7D] hover:underline"
              >
                Inicia sesión aquí
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
