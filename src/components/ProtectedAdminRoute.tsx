
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  useEffect(() => {
    console.log("ProtectedAdminRoute - Estado actual:", { 
      authenticated: !!currentUser, 
      email: currentUser?.email,
      isAdmin, 
      loading 
    });
  }, [currentUser, isAdmin, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Cargando...</span>
      </div>
    );
  }

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

  // Si no hay usuario o no es admin, y tampoco hay sesión de admin, redirigir
  if ((!currentUser || !isAdmin) && !hasAdminSession()) {
    console.log("Acceso denegado - Redirigiendo a /admin-login");
    return <Navigate to="/admin-login" />;
  }

  console.log("Acceso permitido a ruta protegida de administrador");
  return <>{children}</>;
};

export default ProtectedAdminRoute;
