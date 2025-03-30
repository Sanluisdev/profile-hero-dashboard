
import React from "react";
import { NavLink } from "react-router-dom";
import { Users, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">Panel Admin</h2>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md transition-colors
                ${isActive ? 'bg-blue-700' : 'hover:bg-gray-800 text-gray-300'}
              `}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md transition-colors
                ${isActive ? 'bg-blue-700' : 'hover:bg-gray-800 text-gray-300'}
              `}
            >
              <Users className="mr-3 h-5 w-5" />
              Usuarios
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="outline"
          className="w-full justify-start text-white border-gray-700 hover:bg-gray-800 hover:text-white"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
