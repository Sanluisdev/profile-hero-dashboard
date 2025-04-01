
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState("jmesparre@gmail.com");
  const [password, setPassword] = useState("pepito1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail } = useAuth();

  useEffect(() => {
    // Limpiar cualquier error previo
    setError(null);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Intentando iniciar sesión con:", email, password);
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      let errorMessage = "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.";
      
      if (err.code === 'auth/invalid-credential') {
        errorMessage = "Credenciales inválidas. Verifica que hayas escrito correctamente el correo y la contraseña.";
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = "No existe un usuario con ese correo electrónico.";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos fallidos. Por favor, intenta más tarde.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Acceso Administrador</CardTitle>
        <CardDescription>
          Inicia sesión con tus credenciales de administrador
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Acceso exclusivo para administradores
      </CardFooter>
    </Card>
  );
};

export default AdminLoginForm;
