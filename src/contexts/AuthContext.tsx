
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
} from "firebase/auth";
import { 
  auth, 
  googleProvider, 
  saveUserToFirestore,
  signInWithEmailAndSave,
  createUserWithEmailAndPasswordAndSave,
  db
} from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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

  // Verificar en Firestore si el usuario es administrador
  const checkAdminInFirestore = async (user: User | null) => {
    if (!user) return false;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Datos del usuario desde Firestore:", userData);
        return userData?.isAdmin === true;
      }
      return false;
    } catch (error) {
      console.error("Error al verificar admin en Firestore:", error);
      return false;
    }
  };

  // Asegurar que el usuario administrador tenga el campo isAdmin
  const ensureAdminFlag = async (user: User) => {
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) return;

    try {
      console.log("Verificando/configurando flag isAdmin para:", user.email);
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      // Si el documento existe pero no tiene isAdmin=true, añadirlo
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData?.isAdmin !== true) {
          console.log("Actualizando flag isAdmin para el usuario admin");
          await setDoc(userDocRef, { isAdmin: true }, { merge: true });
        }
      } else {
        // Si el documento no existe, crearlo con isAdmin=true
        await setDoc(userDocRef, { 
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Administrador",
          isAdmin: true,
          createdAt: new Date()
        });
        console.log("Documento de admin creado con flag isAdmin");
      }
    } catch (error) {
      console.error("Error al asegurar flag isAdmin:", error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthState changed - Usuario actual:", user?.email);
      
      if (user) {
        // Si es correo de administrador, asegurar que tenga el flag isAdmin
        if (ADMIN_EMAILS.includes(user.email || "")) {
          await ensureAdminFlag(user);
        }
        
        // Guarda información del usuario en Firestore en cada inicio de sesión
        await saveUserToFirestore(user);
        
        // Verificar estado de administrador en Firestore
        const adminStatus = await checkAdminInFirestore(user);
        console.log("¿Es administrador según Firestore?", adminStatus);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
        providerData: [{ providerId: "manual" }],
        metadata: {}
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Verificar si es correo de administrador y asegurar flag isAdmin
      if (ADMIN_EMAILS.includes(result.user.email || "")) {
        await ensureAdminFlag(result.user);
      }
      
      // Guardar información del usuario en Firestore
      await saveUserToFirestore(result.user);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${result.user.displayName}!`,
      });
      
      // Verificar estado de administrador en Firestore
      const adminStatus = await checkAdminInFirestore(result.user);
      setIsAdmin(adminStatus);
      
      // Comprobar si es administrador
      if (adminStatus) {
        console.log("Usuario de Google es administrador");
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
        const result = await signInWithEmailAndSave(email, password);
        
        // Si es admin, asegurar que tenga el flag
        if (ADMIN_EMAILS.includes(result.user.email || "")) {
          await ensureAdminFlag(result.user);
        }
        
        // Verificar estado de administrador en Firestore
        const adminStatus = await checkAdminInFirestore(result.user);
        setIsAdmin(adminStatus);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${result.user.email}!`,
        });
        
        if (adminStatus) {
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

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPasswordAndSave(email, password);
      
      // Si es admin, asegurar que tenga el flag
      if (ADMIN_EMAILS.includes(email)) {
        await ensureAdminFlag(result.user);
      }
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      
      let errorMsg = "Error al crear la cuenta. Por favor, intenta de nuevo.";
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = "Este correo electrónico ya está en uso.";
      } else if (error.code === 'auth/weak-password') {
        errorMsg = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
      }
      
      toast({
        title: "Error de registro",
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
    signUp,
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
