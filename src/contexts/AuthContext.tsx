
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

// Admin credentials
const ADMIN_EMAIL = "jmesparre@gmail.com";
const ADMIN_PASSWORD = "pepito1234";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthState changed - Usuario actual:", user?.email);
      setCurrentUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Esta función es para crear el usuario admin si no existe
  const ensureAdminExists = async () => {
    try {
      console.log("Verificando si existe el usuario admin:", ADMIN_EMAIL);
      try {
        // Primero intentamos iniciar sesión con el usuario admin
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log("Login exitoso con usuario admin existente");
        // Si llegamos aquí, el usuario existe, cerramos sesión para no interferir
        await firebaseSignOut(auth);
      } catch (loginErr: any) {
        console.log("Error al verificar usuario admin:", loginErr);
        // Si el error es porque no existe el usuario, lo creamos
        if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            console.log("Usuario admin creado exitosamente:", userCredential.user.email);
            // Cerramos sesión después de crear el usuario
            await firebaseSignOut(auth);
          } catch (createErr: any) {
            console.log("Error al crear usuario admin:", createErr.code);
            if (createErr.code === 'auth/email-already-in-use') {
              console.log("El usuario admin ya existe pero las credenciales son inválidas");
            } else {
              console.error("Error desconocido al crear usuario admin:", createErr);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error general al verificar/crear usuario admin:", err);
    }
  };

  // Ejecutamos la función para crear el usuario admin cuando se carga la aplicación
  useEffect(() => {
    ensureAdminExists();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${result.user.displayName}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión con Google. Intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("Intentando iniciar sesión con email:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${result.user.email}!`,
      });
      
      if (email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión con correo:", error);
      
      // Mensaje de error más descriptivo
      let errorMsg = "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.";
      if (error.code === 'auth/invalid-credential') {
        errorMsg = "Credenciales inválidas. Verifica tu correo y contraseña.";
      } else if (error.code === 'auth/user-not-found') {
        errorMsg = "No existe un usuario con ese correo electrónico.";
      }
      
      toast({
        title: "Error de inicio de sesión",
        description: errorMsg,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error al cerrar sesión",
        description: "Ocurrió un problema al cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
