
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

// Definición de credenciales del administrador (método alternativo)
const ADMIN_EMAIL = "jmesparre@gmail.com";
const ADMIN_PASSWORD = "pepito1234";

// Lista de correos de administradores para verificación manual
const ADMIN_EMAILS = ["jmesparre@gmail.com"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar si un correo es de administrador
  const checkIsAdmin = (email: string | null | undefined) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthState changed - Usuario actual:", user?.email);
      setCurrentUser(user);
      
      // Determinar si el usuario es administrador por su correo
      const adminStatus = checkIsAdmin(user?.email);
      console.log("¿Es administrador?", adminStatus);
      setIsAdmin(adminStatus);
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Método alternativo de autenticación para el administrador
  const signInManuallyAsAdmin = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("Autenticación manual como administrador exitosa");
      // Crear un objeto User simple para simular la autenticación
      const fakeAdminUser = {
        email: ADMIN_EMAIL,
        displayName: "Administrador",
        uid: "admin-uid-123",
        emailVerified: true,
      } as User;
      
      setCurrentUser(fakeAdminUser);
      setIsAdmin(true);
      
      // Guardar en sessionStorage (se borrará al cerrar el navegador)
      sessionStorage.setItem('adminAuth', JSON.stringify({ 
        email: ADMIN_EMAIL, 
        isAdmin: true 
      }));
      
      return true;
    }
    return false;
  };

  // Restaurar la sesión de administrador si existe en sessionStorage
  useEffect(() => {
    const savedAdminAuth = sessionStorage.getItem('adminAuth');
    if (savedAdminAuth) {
      try {
        const adminData = JSON.parse(savedAdminAuth);
        if (adminData.isAdmin && adminData.email === ADMIN_EMAIL) {
          console.log("Restaurando sesión de administrador");
          const fakeAdminUser = {
            email: ADMIN_EMAIL,
            displayName: "Administrador",
            uid: "admin-uid-123",
            emailVerified: true,
          } as User;
          
          setCurrentUser(fakeAdminUser);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error al restaurar sesión de administrador:", error);
      }
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${result.user.displayName}!`,
      });
      
      // Comprobar si es administrador
      if (checkIsAdmin(result.user.email)) {
        console.log("Usuario de Google es administrador");
        setIsAdmin(true);
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
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
      
      // Primero intentamos la autenticación manual para el administrador
      if (email === ADMIN_EMAIL) {
        console.log("Intentando autenticación manual como administrador");
        const success = signInManuallyAsAdmin(email, password);
        
        if (success) {
          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido, Administrador!",
          });
          navigate("/admin");
          return;
        }
      }
      
      // Si no es administrador o falló la autenticación manual, intentamos con Firebase
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${result.user.email}!`,
        });
        
        if (checkIsAdmin(result.user.email)) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (firebaseError: any) {
        console.error("Error con Firebase:", firebaseError);
        
        // Si hay error con Firebase pero es el admin, intentamos autenticación manual
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const success = signInManuallyAsAdmin(email, password);
          if (success) {
            toast({
              title: "Inicio de sesión exitoso",
              description: "Bienvenido, Administrador!",
            });
            navigate("/admin");
            return;
          }
        }
        
        throw firebaseError;
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión con correo:", error);
      
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
      // Cerrar sesión en Firebase
      await firebaseSignOut(auth);
      
      // Limpiar la sesión de administrador si existe
      sessionStorage.removeItem('adminAuth');
      
      // Reiniciar el estado
      setCurrentUser(null);
      setIsAdmin(false);
      
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
