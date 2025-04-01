
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  lastLogin?: string;
  provider?: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Consultando usuarios en Firestore...");
        const usersCollection = collection(db, "users");
        
        // Creamos una consulta simple sin orderBy para evitar problemas de índices
        const usersQuery = query(usersCollection, limit(50));
        
        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.empty) {
          console.log("No se encontraron usuarios en Firestore");
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
              createdAt: userData.createdAt || null,
              lastLogin: userData.lastLogin || null,
              provider: userData.provider || "Email/Password"
            });
          });
          
          setUsers(usersList);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("Error al cargar los usuarios. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    // Añadimos un pequeño retraso para asegurarnos de que Firebase esté completamente inicializado
    const timer = setTimeout(() => {
      fetchUsers();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span>Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead>Último acceso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                  <p>No hay usuarios registrados en la colección "users"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Es posible que necesites crear usuarios o verificar los permisos de Firestore
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar>
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
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.displayName || "Usuario sin nombre"}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-xs max-w-[120px] truncate">{user.uid}</TableCell>
                <TableCell>{user.provider || "N/A"}</TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                </TableCell>
                <TableCell>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
