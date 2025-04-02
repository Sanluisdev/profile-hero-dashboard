
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.header 
          className="bg-white shadow-md border-b-2 border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-gray-900">Panel de Administración</h1>
              
              {currentUser && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-600">
                    {currentUser.email}
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-blue-200">
                    <AvatarImage src={currentUser.photoURL || ''} alt="Admin" />
                    <AvatarFallback className="bg-blue-500 text-white font-bold">
                      {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </motion.header>
        
        <main className="max-w-7xl mx-auto py-6 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
