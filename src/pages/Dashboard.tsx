
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import FileUploader from "@/components/FileUploader";

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [phone, setPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diseases, setDiseases] = useState("");
  const [medications, setMedications] = useState("");

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  const handleUpdateName = async () => {
    if (!currentUser) return;

    try {
      // Update displayName in Firebase Auth
      await updateProfile(currentUser, {
        displayName: displayName,
      });

      // Update displayName in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName,
      });

      setIsEditingName(false);
      toast({
        title: "Nombre actualizado",
        description: "Tu nombre ha sido actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el nombre",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        phone,
        medicalInfo: {
          allergies,
          diseases,
          medications
        }
      });
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la información",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-24 px-6">
        <div className="mb-12 pt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido de nuevo, {currentUser.displayName}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perfil del usuario */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Perfil Personal</CardTitle>
              <CardDescription>Información de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                  <img 
                    src={currentUser.photoURL || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://ui-avatars.com/api/?name=" + currentUser.displayName;
                    }}
                  />
                </div>
                <div className="text-center">
                  {isEditingName ? (
                    <div className="space-y-2">
                      <Input 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        className="text-center"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" onClick={handleUpdateName}>Guardar</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-medium text-gray-900">{currentUser.displayName}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setIsEditingName(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-gray-500">{currentUser.email}</p>
                </div>
                <div className="pt-4 w-full">
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Información personal */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre completo</h4>
                  <p className="text-gray-900">{currentUser.displayName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Correo electrónico</h4>
                  <p className="text-gray-900">{currentUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ingresa tu número de teléfono"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">
                  Guardar información personal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información Clínica */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Información Clínica</CardTitle>
              <CardDescription>Información médica relevante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Alergias</h4>
                  <Textarea 
                    value={allergies} 
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Describe tus alergias"
                    rows={4}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Enfermedades</h4>
                  <Textarea 
                    value={diseases} 
                    onChange={(e) => setDiseases(e.target.value)}
                    placeholder="Describe tus enfermedades"
                    rows={4}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Medicamentos prescriptos</h4>
                  <Textarea 
                    value={medications} 
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="Lista tus medicamentos"
                    rows={4}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="w-full mt-6">
                Guardar información clínica
              </Button>
            </CardContent>
          </Card>

          {/* Estudios Clínicos */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Estudios Clínicos</CardTitle>
              <CardDescription>Sube tus estudios clínicos</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader userId={currentUser.uid} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
