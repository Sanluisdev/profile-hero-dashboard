
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

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
        
        // Ordenamos por fecha de creación descendente (lo más nuevo primero)
        const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
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

    fetchUsers();
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
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
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://ui-avatars.com/api/?name=" + (user.displayName || "User");
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                    <span>{user.displayName || "Usuario sin nombre"}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-xs">{user.uid}</TableCell>
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
