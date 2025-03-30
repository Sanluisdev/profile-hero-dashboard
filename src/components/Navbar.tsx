
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, signInWithGoogle, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-sm px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MiApp
        </Link>

        <div className="flex gap-4 items-center">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center mr-4">
                <img 
                  src={currentUser.photoURL || ''} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=" + currentUser.displayName;
                  }}
                />
                <span className="text-sm font-medium">
                  {currentUser.displayName}
                </span>
              </div>
              <Link to="/dashboard">
                <Button variant="outline">Mi Perfil</Button>
              </Link>
              <Button onClick={signOut} variant="ghost">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button onClick={signInWithGoogle} variant="outline">
                Login
              </Button>
              <Button onClick={signInWithGoogle}>
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
