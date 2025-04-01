
import React from "react";
import UserTable from "@/components/UserTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const UsersPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Agregar Usuario</span>
        </Button>
      </div>
      
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4 mr-2" />
        <AlertDescription>
          Se muestran todos los usuarios registrados en la plataforma. Los usuarios pueden ser administrados desde esta sección.
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
