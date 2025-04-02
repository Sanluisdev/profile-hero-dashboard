
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              
              {currentUser && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {currentUser.email}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
