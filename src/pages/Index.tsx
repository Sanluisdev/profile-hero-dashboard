
import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      signInWithGoogle();
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      
      {/* Hero Section */}
      <div className="w-screen h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-30">
          {/* Background pattern or overlay */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1')] bg-center bg-cover"></div>
        </div>
        
        <div className="container mx-auto px-6 z-10 mt-16">
          <div className="flex flex-col items-center text-center text-white space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
              Tu plataforma personal de gestión de información
            </h1>
            
            <p className="text-xl md:text-2xl max-w-2xl text-blue-100">
              Accede a tu información personal de forma segura desde cualquier dispositivo
            </p>
            
            <div className="pt-8">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6"
              >
                {currentUser ? "Ir a Mi Perfil" : "Comenzar Ahora"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido adicional de la landing page */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">Características Principales</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguridad Avanzada</h3>
              <p className="text-gray-600">Protegemos tu información con los más altos estándares de seguridad.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-gray-600">Interfaz intuitiva diseñada para una experiencia sin complicaciones.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Acceso desde Cualquier Lugar</h3>
              <p className="text-gray-600">Accede a tu información desde cualquier dispositivo en cualquier momento.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">© 2023 MiApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
