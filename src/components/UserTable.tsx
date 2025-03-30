
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { User } from "firebase/auth";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Como Firebase Auth no tiene una API para listar usuarios desde el cliente,
        // vamos a obtener usuarios actualmente autenticados como ejemplo
        // En un sistema real, necesitarías una función de Cloud Function o similar
        
        // Por ahora, mostraremos solo el usuario actual como ejemplo
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const userList: FirebaseUser[] = [{
            uid: currentUser.uid,
            email: currentUser.email || "No email",
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: currentUser.metadata.creationTime,
            lastLogin: currentUser.metadata.lastSignInTime,
            provider: currentUser.providerData[0]?.providerId || "Unknown"
          }];
          
          // En una aplicación real, aquí obtendrías usuarios de Firestore 
          // donde deberías almacenarlos cuando se registran
          try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            usersSnapshot.forEach((doc) => {
              const userData = doc.data() as FirebaseUser;
              // Evitar duplicados
              if (!userList.some(u => u.uid === userData.uid)) {
                userList.push(userData);
              }
            });
          } catch (error) {
            console.log("No se encontró una colección de usuarios en Firestore");
          }
          
          setUsers(userList);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
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
                <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
