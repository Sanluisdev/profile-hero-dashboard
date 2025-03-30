
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

const ADMIN_EMAIL = "jmesparre@gmail.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Esta función es para crear el usuario admin si no existe (solo para desarrollo)
  const ensureAdminExists = async () => {
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, "pepito1234");
      console.log("Admin ya existe, inicio de sesión exitoso");
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, "pepito1234");
          console.log("Usuario admin creado exitosamente");
        } catch (createErr) {
          console.error("Error al crear usuario admin:", createErr);
        }
      } else {
        console.error("Error al verificar usuario admin:", err);
      }
    }
  };

  // Descomentar esta línea para crear el usuario admin (solo en desarrollo)
  // useEffect(() => {
  //   ensureAdminExists();
  // }, []);

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
    } catch (error) {
      console.error("Error al iniciar sesión con correo:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "Correo o contraseña incorrectos.",
        variant: "destructive",
      });
      throw error; // Re-lanzamos el error para que pueda ser capturado por el componente
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
