
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const UserSidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const menuItems = [
    {
      title: "Perfil",
      icon: User,
      path: "/dashboard",
    },
    {
      title: "Panel",
      icon: Home,
      path: "/panel",
    },
    {
      title: "Citas",
      icon: Calendar,
      path: "/citas",
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Menu for larger screens
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-200">
      <div className="flex flex-col items-center p-6 border-b">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 mb-3">
          <img 
            src={currentUser?.photoURL || ''} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://ui-avatars.com/api/?name=" + (currentUser?.displayName || 'U');
            }}
          />
        </div>
        <h3 className="text-lg font-semibold">{currentUser?.displayName || 'Usuario'}</h3>
      </div>
      
      <div className="flex flex-col p-4 space-y-2">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive(item.path) ? "bg-blue-600 text-white" : "text-gray-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
  
  // Menu for mobile screens
  const MobileSidebar = () => (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0">
          <div className="flex flex-col items-center p-6 border-b">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 mb-3">
              <img 
                src={currentUser?.photoURL || ''} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://ui-avatars.com/api/?name=" + (currentUser?.displayName || 'U');
                }}
              />
            </div>
            <h3 className="text-lg font-semibold">{currentUser?.displayName || 'Usuario'}</h3>
          </div>
          
          <div className="flex flex-col p-4 space-y-2">
            {menuItems.map((item) => (
              <SheetClose asChild key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive(item.path) ? "bg-blue-600 text-white" : "text-gray-600"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Button>
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default UserSidebar;
