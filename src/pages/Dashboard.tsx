
import React from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-24 px-6">
        <div className="mb-12 pt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido de nuevo, {currentUser.displayName}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perfil del usuario */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Perfil Personal</CardTitle>
              <CardDescription>Información de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                  <img 
                    src={currentUser.photoURL || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://ui-avatars.com/api/?name=" + currentUser.displayName;
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-900">{currentUser.displayName}</h3>
                  <p className="text-gray-500">{currentUser.email}</p>
                </div>
                <div className="pt-4 w-full">
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Información personal */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre completo</h4>
                  <p className="text-gray-900">{currentUser.displayName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Correo electrónico</h4>
                  <p className="text-gray-900">{currentUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID de usuario</h4>
                  <p className="text-gray-900">{currentUser.uid}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Último inicio de sesión</h4>
                  <p className="text-gray-900">
                    {currentUser.metadata.lastSignInTime 
                      ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() 
                      : "No disponible"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cuenta creada</h4>
                  <p className="text-gray-900">
                    {currentUser.metadata.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleString()
                      : "No disponible"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
