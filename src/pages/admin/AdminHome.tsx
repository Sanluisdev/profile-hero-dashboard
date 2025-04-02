
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Server, Activity, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const AdminHome: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6">Dashboard</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold">Total Usuarios</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">1</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% desde el último mes
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all bg-pink-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold">Estado del Sistema</CardTitle>
              <Server className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-extrabold flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Operativo
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                100% tiempo de actividad
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold">Actividad</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Operaciones realizadas hoy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-4">Información del sistema</h3>
        <Card className="border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)]">
          <CardHeader>
            <CardTitle>Estado del sistema</CardTitle>
            <CardDescription>
              Información general sobre el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-muted-foreground">Versión</p>
                  <p className="font-semibold">1.0.0</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-muted-foreground">Ambiente</p>
                  <p className="font-semibold">Producción</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <p className="font-semibold">Operativo</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-muted-foreground">Último despliegue</p>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminHome;
