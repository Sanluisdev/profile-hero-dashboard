
import React from "react";
import UserTable from "@/components/UserTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    toast({
      title: "Actualizando usuarios",
      description: "Recargaremos la lista de usuarios",
    });
    window.location.reload();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="neo-subtitle text-black">Gestión de Usuarios</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh} 
            className="flex items-center gap-2 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-y-1 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
          
          <Button className="flex items-center gap-2 bg-neo-teal border-2 border-black text-white font-bold shadow-neo-sm hover:shadow-none hover:translate-y-1 transition-all">
            <UserPlus className="h-4 w-4" />
            <span>Agregar Usuario</span>
          </Button>
        </div>
      </div>
      
      <Alert className="mb-4 border-2 border-black bg-neo-yellow/20">
        <InfoIcon className="h-4 w-4 mr-2" />
        <AlertDescription>
          Se muestran todos los usuarios registrados en la colección "users" de Firestore. Si no ves usuarios, verifica que exista esta colección en tu base de datos.
        </AlertDescription>
      </Alert>
      
      <div className="neo-card p-6 animate-pop">
        <h3 className="text-lg font-bold mb-4 text-black">Usuarios registrados</h3>
        <UserTable />
      </div>
    </div>
  );
};

export default UsersPage;
