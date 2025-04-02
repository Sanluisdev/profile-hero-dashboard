
import React from "react";
import Navbar from "@/components/Navbar";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const AdminLogin: React.FC = () => {
  const { currentUser, isAdmin, loading } = useAuth();

  // Mostrar un spinner mientras se comprueba la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
          <span className="mt-4 text-foreground font-medium">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  // Si ya está autenticado como admin, redireccionar al dashboard de admin
  if (currentUser && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-extrabold text-center mb-2 text-blue-600">Panel de Administración</h1>
          <p className="text-center text-gray-600 mb-8">
            Esta área es exclusiva para administradores del sistema.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AdminLoginForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
