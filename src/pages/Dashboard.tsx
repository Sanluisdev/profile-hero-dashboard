
import React, { useState, useEffect } from "react";
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
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import FileUploader from "@/components/FileUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [phone, setPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diseases, setDiseases] = useState("");
  const [medications, setMedications] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setPhone(userData.phone || "");
          setAllergies(userData.medicalInfo?.allergies || "");
          setDiseases(userData.medicalInfo?.diseases || "");
          setMedications(userData.medicalInfo?.medications || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="mt-4 h-4 w-32 bg-muted"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="mt-4 h-4 w-32 bg-muted"></div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-16 px-4 sm:px-6">
        <div className="mb-10 pt-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Mi Dashboard</h1>
          <p className="text-muted-foreground text-lg">Bienvenido de nuevo, <span className="font-semibold text-foreground">{currentUser.displayName}</span></p>
        </div>
        
        <Tabs defaultValue="profile" className="mb-8">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="medical">Información Médica</TabsTrigger>
            <TabsTrigger value="documents">Estudios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Perfil del usuario */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Perfil Personal</CardTitle>
                  <CardDescription>Información de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                      <AvatarImage 
                        src={currentUser.photoURL || ''}
                        alt="Profile" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://ui-avatars.com/api/?name=" + currentUser.displayName;
                        }}
                      />
                      <AvatarFallback className="text-2xl font-bold">
                        {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
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
                          <h3 className="text-xl font-medium text-foreground">{currentUser.displayName}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full" 
                            onClick={() => setIsEditingName(true)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-muted-foreground">{currentUser.email}</p>
                      <Badge variant="outline" className="mt-2">Usuario</Badge>
                    </div>
                    <div className="pt-4 w-full">
                      <Button variant="destructive" className="w-full" onClick={signOut}>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Nombre completo</h4>
                        <p className="text-foreground font-medium">{currentUser.displayName || "No especificado"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Correo electrónico</h4>
                        <p className="text-foreground font-medium">{currentUser.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Teléfono</h4>
                        <Input 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ingresa tu número de teléfono"
                        />
                      </div>
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                      Guardar información personal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="medical" className="space-y-6 mt-6">
            {/* Información Clínica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Clínica</CardTitle>
                <CardDescription>Información médica relevante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Alergias</h4>
                    <Textarea 
                      value={allergies} 
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="Describe tus alergias"
                      rows={4}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Enfermedades</h4>
                    <Textarea 
                      value={diseases} 
                      onChange={(e) => setDiseases(e.target.value)}
                      placeholder="Describe tus enfermedades"
                      rows={4}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Medicamentos prescriptos</h4>
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
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 mt-6">
            {/* Estudios Clínicos */}
            <Card>
              <CardHeader>
                <CardTitle>Estudios Clínicos</CardTitle>
                <CardDescription>Sube tus estudios clínicos</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader userId={currentUser.uid} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
