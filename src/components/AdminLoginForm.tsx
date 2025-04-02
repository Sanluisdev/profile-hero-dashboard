
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

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
      console.log("Inicio de sesión exitoso");
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
    <Card className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center border-4 border-black">
            <ShieldAlert className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Acceso Administrador</CardTitle>
        <CardDescription className="text-center">
          Inicia sesión con tus credenciales de administrador
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-4 border-2 border-black">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-2 border-black"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-2 border-black"
                required
              />
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all" 
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-center text-sm text-muted-foreground">
        <div>
          <p>Acceso exclusivo para administradores</p>
          <p className="mt-2 text-xs text-center">
            Usa: jmesparre@gmail.com / pepito1234
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminLoginForm;
