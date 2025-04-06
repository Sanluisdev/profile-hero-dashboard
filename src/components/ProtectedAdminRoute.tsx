
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const [verifiedAdmin, setVerifiedAdmin] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);

  // Verificar directamente en Firestore para estar seguros
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!currentUser) {
        setVerifiedAdmin(false);
        setVerifying(false);
        return;
      }

      try {
        console.log("Verificando estado de admin en Firestore para:", currentUser.email);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Datos del usuario desde Firestore:", userData);
          setVerifiedAdmin(userData?.isAdmin === true);
        } else {
          console.log("No existe documento del usuario en Firestore");
          setVerifiedAdmin(false);
        }
      } catch (error) {
        console.error("Error verificando admin status:", error);
        setVerifiedAdmin(false);
      } finally {
        setVerifying(false);
      }
    };

    if (!loading) {
      verifyAdminStatus();
    }
  }, [currentUser, loading]);

  useEffect(() => {
    console.log("ProtectedAdminRoute - Estado actual:", { 
      authenticated: !!currentUser, 
      email: currentUser?.email,
      isAdmin, 
      verifiedAdmin,
      loading,
      verifying
    });
  }, [currentUser, isAdmin, verifiedAdmin, loading, verifying]);

  // Verificar si hay una sesión de administrador en sessionStorage
  const hasAdminSession = () => {
    try {
      const savedAdminAuth = sessionStorage.getItem('adminAuth');
      if (savedAdminAuth) {
        const adminData = JSON.parse(savedAdminAuth);
        return adminData.isAdmin === true;
      }
      return false;
    } catch (error) {
      console.error("Error al verificar sesión de administrador:", error);
      return false;
    }
  };

  if (loading || verifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Verificando permisos...</span>
      </div>
    );
  }

  // Si el usuario está autenticado y es administrador según cualquiera de los métodos, permitir acceso
  const isAuthorized = (isAdmin || verifiedAdmin === true || hasAdminSession());
  
  if (!isAuthorized) {
    console.log("Acceso denegado - Redirigiendo a /admin-login");
    return <Navigate to="/admin-login" />;
  }

  console.log("Acceso permitido a ruta protegida de administrador");
  return <>{children}</>;
};

export default ProtectedAdminRoute;
