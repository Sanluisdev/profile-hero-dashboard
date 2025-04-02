
import React from "react";
import UserTable from "@/components/UserTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold">Gestión de Usuarios</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh} 
            className="flex items-center gap-2 border-2 border-black"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
          
          <Button className="flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all">
            <UserPlus className="h-4 w-4" />
            <span>Agregar Usuario</span>
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Alert className="mb-4 border-2 border-black bg-yellow-50">
          <InfoIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Se muestran todos los usuarios registrados en la colección "users" de Firestore. Si no ves usuarios, verifica que exista esta colección en tu base de datos.
          </AlertDescription>
        </Alert>
      </motion.div>
      
      <motion.div 
        className="bg-white p-6 rounded-lg border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-bold mb-4">Usuarios registrados</h3>
        <UserTable />
      </motion.div>
    </div>
  );
};

export default UsersPage;
