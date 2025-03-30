
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Cargando...</span>
      </div>
    );
  }

  console.log("Protected Admin Route:", { currentUser, isAdmin });

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
