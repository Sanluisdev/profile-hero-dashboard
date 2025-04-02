
import React from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900">
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 right-20 h-32 w-32 rounded-full bg-yellow-400 opacity-60"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 h-48 w-48 rounded-full bg-pink-500 opacity-40"
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute right-[10%] top-[40%] h-64 w-64 rounded-full bg-purple-500 opacity-30 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        
        <div className="container relative z-10 mx-auto px-6 flex items-center justify-center h-full">
          <div className="max-w-3xl flex flex-col items-center text-center space-y-8">
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold leading-tight text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Tu plataforma personal de gestión de información
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Accede a tu información personal de forma segura desde cualquier dispositivo
            </motion.p>
            
            <motion.div 
              className="pt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 font-bold rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all"
              >
                {currentUser ? "Ir a Mi Perfil" : "Comenzar Ahora"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Características Principales</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div 
              className="flex flex-col items-center text-center p-6 border-4 border-black rounded-xl bg-blue-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 border-4 border-black">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Seguridad Avanzada</h3>
              <p className="text-gray-600">Protegemos tu información con los más altos estándares de seguridad.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 border-4 border-black rounded-xl bg-pink-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mb-4 border-4 border-black">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Fácil de Usar</h3>
              <p className="text-gray-600">Interfaz intuitiva diseñada para una experiencia sin complicaciones.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6 border-4 border-black rounded-xl bg-green-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 border-4 border-black">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Acceso desde Cualquier Lugar</h3>
              <p className="text-gray-600">Accede a tu información desde cualquier dispositivo en cualquier momento.</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-10 border-t-4 border-black">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 font-medium">© 2023 MiApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
