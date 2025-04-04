
import React from "react";
import Navbar from "@/components/Navbar";
import UserSidebar from "@/components/UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Panel: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        <UserSidebar />
        
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mi Panel</h1>
            <p className="text-gray-600">Bienvenido de nuevo, {currentUser.displayName}!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Resumen de tu actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenido del panel en desarrollo...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximas actividades</CardTitle>
                <CardDescription>Actividades programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p>No hay actividades programadas por el momento.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
