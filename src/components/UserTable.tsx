
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, getDocs, query, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: any;
  lastLogin?: any;
  provider?: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Consultando usuarios en Firestore...");
      
      // Intento 1: Obtener todos los usuarios de la colección
      try {
        const usersCollection = collection(db, "users");
        const usersQuery = query(usersCollection, limit(50));
        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.empty) {
          console.log("No se encontraron usuarios en la colección 'users'");
          
          // Intentar buscar un documento específico (prueba de acceso)
          const testDocRef = doc(db, "users", "test");
          await getDoc(testDocRef);
          
          // Si llegamos aquí, tenemos acceso pero no hay documentos
          setUsers([]);
        } else {
          console.log(`Se encontraron ${usersSnapshot.size} usuarios en Firestore`);
          const usersList: FirebaseUser[] = [];
          
          usersSnapshot.forEach((doc) => {
            const userData = doc.data() as FirebaseUser;
            usersList.push({
              uid: doc.id,
              email: userData.email || "No email",
              displayName: userData.displayName || null,
              photoURL: userData.photoURL || null,
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
              provider: userData.provider || "Email/Password"
            });
          });
          
          setUsers(usersList);
        }
      } catch (error: any) {
        console.error("Error al obtener usuarios:", error);
        
        if (error.code === "permission-denied") {
          setError("Error de permisos: No tienes acceso a la colección 'users'. Verifica las reglas de seguridad de Firestore.");
        } else {
          setError(`Error al cargar los usuarios: ${error.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Añadimos un pequeño retraso para asegurarnos de que Firebase esté completamente inicializado
    const timer = setTimeout(() => {
      fetchUsers();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    toast({
      title: "Actualizando datos",
      description: "Recargando lista de usuarios..."
    });
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-neo-purple mr-2" />
        <span className="font-medium">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4 border-2 border-black bg-red-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="flex items-center gap-2 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-y-1 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </Button>
      </div>
      
      <div className="w-full overflow-auto border-2 border-black rounded-lg shadow-neo">
        <Table>
          <TableHeader>
            <TableRow className="bg-neo-purple/10 hover:bg-neo-purple/20">
              <TableHead className="font-bold">Usuario</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">Proveedor</TableHead>
              <TableHead className="font-bold">Fecha de creación</TableHead>
              <TableHead className="font-bold">Último acceso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-neo-yellow mb-2" />
                    <p className="font-medium">No hay usuarios registrados en la colección "users"</p>
                    <p className="text-sm text-black/70 mt-1">
                      Es posible que necesites crear usuarios o verificar los permisos de Firestore
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid} className="hover:bg-neo-blue/10 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="border-2 border-black">
                        {user.photoURL ? (
                          <AvatarImage 
                            src={user.photoURL} 
                            alt={user.displayName || "Usuario"}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <AvatarFallback className="bg-neo-purple text-white">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.displayName || "Usuario sin nombre"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[120px] truncate bg-black text-white p-1 rounded">{user.uid}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-neo-teal/20 rounded-full text-xs font-medium">
                      {user.provider || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin.seconds * 1000).toLocaleString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
