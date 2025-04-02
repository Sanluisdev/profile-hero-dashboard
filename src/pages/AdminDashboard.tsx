
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-screen bg-[#FFF9E7] overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b-2 border-black">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="neo-subtitle text-black">Panel de Administración</h1>
              
              {currentUser && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-black/70">
                    {currentUser.email}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-neo-purple border-2 border-black flex items-center justify-center shadow-neo-sm">
                    <span className="text-white font-bold">
                      {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-6 animate-pop">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
