
import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen relative overflow-hidden bg-[#FFF9E7]">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="sticker w-24 h-24 bg-neo-pink top-20 left-10 animate-float hidden lg:block"></div>
      <div className="sticker w-16 h-16 bg-neo-blue bottom-20 left-20 animate-float animation-delay-1000 hidden lg:block"></div>
      <div className="sticker w-20 h-20 bg-neo-yellow top-40 right-20 animate-wiggle hidden lg:block"></div>
      <div className="sticker w-16 h-16 bg-neo-teal bottom-40 right-10 animate-float animation-delay-2000 hidden lg:block"></div>
      
      {/* Hero Section */}
      <div className="w-full min-h-[90vh] flex items-center justify-center">
        <div className="container mx-auto px-6 z-10 mt-16">
          <div className="flex flex-col items-center text-center space-y-8 animate-slide-up">
            <h1 className="neo-title max-w-3xl text-black">
              Tu plataforma personal de <span className="text-neo-purple">gestión</span> de información
            </h1>
            
            <p className="text-xl md:text-2xl max-w-2xl text-black/70">
              Accede a tu información personal de forma segura desde cualquier dispositivo
            </p>
            
            <div className="pt-8">
              <button 
                onClick={handleGetStarted}
                className="neo-button group flex items-center gap-2"
              >
                {currentUser ? "Ir a Mi Perfil" : "Comenzar Ahora"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-pop">
            <h2 className="neo-subtitle text-black">Características Principales</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="neo-section flex flex-col items-center text-center transform hover:rotate-1 transition-transform">
              <div className="w-16 h-16 bg-neo-purple rounded-full flex items-center justify-center mb-4 border-2 border-black">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Seguridad Avanzada</h3>
              <p className="text-black/70">Protegemos tu información con los más altos estándares de seguridad.</p>
            </div>
            
            <div className="neo-section flex flex-col items-center text-center transform hover:-rotate-1 transition-transform">
              <div className="w-16 h-16 bg-neo-teal rounded-full flex items-center justify-center mb-4 border-2 border-black">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fácil de Usar</h3>
              <p className="text-black/70">Interfaz intuitiva diseñada para una experiencia sin complicaciones.</p>
            </div>
            
            <div className="neo-section flex flex-col items-center text-center transform hover:rotate-1 transition-transform">
              <div className="w-16 h-16 bg-neo-pink rounded-full flex items-center justify-center mb-4 border-2 border-black">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Acceso desde Cualquier Lugar</h3>
              <p className="text-black/70">Accede a tu información desde cualquier dispositivo en cualquier momento.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white">© 2023 MiApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
