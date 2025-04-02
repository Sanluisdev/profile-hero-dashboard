
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Check, Server } from "lucide-react";

const AdminHome: React.FC = () => {
  return (
    <div>
      <h2 className="neo-subtitle mb-6 text-black">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="neo-card hover:bg-neo-purple/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Total Usuarios</CardTitle>
            <Users className="h-5 w-5 text-neo-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">1</div>
            <p className="text-xs text-black/70 mt-1">
              +0% desde el último mes
            </p>
          </CardContent>
        </Card>
        
        <Card className="neo-card hover:bg-neo-teal/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Actividad</CardTitle>
            <Activity className="h-5 w-5 text-neo-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">100%</div>
            <p className="text-xs text-black/70 mt-1">
              De servicios activos
            </p>
          </CardContent>
        </Card>
        
        <Card className="neo-card hover:bg-neo-pink/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Estado</CardTitle>
            <Check className="h-5 w-5 text-neo-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">OK</div>
            <p className="text-xs text-black/70 mt-1">
              Todos los sistemas operativos
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 animate-slide-up">
        <h3 className="text-xl font-bold mb-4 text-black">Información del sistema</h3>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Estado del sistema</CardTitle>
            <CardDescription className="text-black/70">
              Información general sobre el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border-2 border-black rounded-lg hover:bg-neo-yellow/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <p className="text-sm font-bold text-black">Versión</p>
                  </div>
                  <p className="ml-6 mt-1">1.0.0</p>
                </div>
                
                <div className="p-3 border-2 border-black rounded-lg hover:bg-neo-blue/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm font-bold text-black">Ambiente</p>
                  </div>
                  <p className="ml-6 mt-1">Producción</p>
                </div>
                
                <div className="p-3 border-2 border-black rounded-lg hover:bg-neo-teal/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-bold text-black">Estado</p>
                  </div>
                  <div className="flex items-center ml-6 mt-1">
                    <div className="h-2 w-2 rounded-full bg-neo-teal border border-black mr-2"></div>
                    <p>Operativo</p>
                  </div>
                </div>
                
                <div className="p-3 border-2 border-black rounded-lg hover:bg-neo-purple/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-bold text-black">Último despliegue</p>
                  </div>
                  <p className="ml-6 mt-1">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
