
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
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
          
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Agregar Usuario</span>
          </Button>
        </div>
      </div>
      
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4 mr-2" />
        <AlertDescription>
          Se muestran todos los usuarios registrados en la colección "users" de Firestore. Si no ves usuarios, verifica que exista esta colección en tu base de datos.
        </AlertDescription>
      </Alert>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Usuarios registrados</h3>
        <UserTable />
      </div>
    </div>
  );
};

export default UsersPage;
