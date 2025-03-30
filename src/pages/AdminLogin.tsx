
import React from "react";
import Navbar from "@/components/Navbar";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  // Si ya está autenticado como admin, redireccionar al dashboard de admin
  if (currentUser && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Panel de Administración</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default AdminLogin;
