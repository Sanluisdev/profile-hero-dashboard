
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
import { LogOut, Calendar, Clock, UserCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FFF9E7] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-neo-purple border-t-transparent rounded-full"></div>
        <span className="ml-3 font-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E7] relative overflow-hidden">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="sticker w-16 h-16 bg-neo-pink top-40 right-10 animate-float hidden lg:block"></div>
      <div className="sticker w-20 h-20 bg-neo-yellow bottom-20 left-10 animate-wiggle hidden lg:block"></div>
      
      <div className="container mx-auto py-24 px-6">
        <div className="mb-12 pt-10 animate-slide-up">
          <h1 className="neo-title text-black mb-2">Mi Dashboard</h1>
          <p className="text-xl text-black/70">Bienvenido de nuevo, {currentUser.displayName || "Usuario"}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perfil del usuario */}
          <Card className="neo-card md:col-span-1 animate-pop">
            <CardHeader className="pb-2">
              <CardTitle className="font-bold">Perfil Personal</CardTitle>
              <CardDescription className="text-black/70">Información de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-black shadow-neo-sm">
                  <img 
                    src={currentUser.photoURL || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://ui-avatars.com/api/?name=" + currentUser.displayName + "&background=9b87f5&color=fff";
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-black">{currentUser.displayName || "Usuario"}</h3>
                  <p className="text-black/70">{currentUser.email}</p>
                </div>
                <div className="pt-4 w-full">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-black hover:bg-neo-pink hover:text-white transition-colors flex items-center justify-center gap-2 shadow-neo-sm hover:shadow-none hover:translate-y-1" 
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Información personal */}
          <Card className="neo-card md:col-span-2 animate-slide-right">
            <CardHeader className="pb-2">
              <CardTitle className="font-bold">Información Personal</CardTitle>
              <CardDescription className="text-black/70">Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-black rounded-lg hover:bg-neo-blue/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5" />
                    <h4 className="text-sm font-bold text-black">Nombre completo</h4>
                  </div>
                  <p className="mt-1 ml-8 text-black">{currentUser.displayName || "Usuario sin nombre"}</p>
                </div>
                
                <div className="p-4 border-2 border-black rounded-lg hover:bg-neo-teal/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-sm font-bold text-black">Correo electrónico</h4>
                  </div>
                  <p className="mt-1 ml-8 text-black">{currentUser.email}</p>
                </div>
                
                <div className="p-4 border-2 border-black rounded-lg hover:bg-neo-yellow/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <h4 className="text-sm font-bold text-black">ID de usuario</h4>
                  </div>
                  <p className="mt-1 ml-8 font-mono text-xs bg-black text-white p-2 rounded">{currentUser.uid}</p>
                </div>
                
                <div className="p-4 border-2 border-black rounded-lg hover:bg-neo-purple/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <h4 className="text-sm font-bold text-black">Último inicio de sesión</h4>
                  </div>
                  <p className="mt-1 ml-8 text-black">
                    {currentUser.metadata.lastSignInTime 
                      ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() 
                      : "No disponible"}
                  </p>
                </div>
                
                <div className="p-4 border-2 border-black rounded-lg hover:bg-neo-pink/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <h4 className="text-sm font-bold text-black">Cuenta creada</h4>
                  </div>
                  <p className="mt-1 ml-8 text-black">
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
