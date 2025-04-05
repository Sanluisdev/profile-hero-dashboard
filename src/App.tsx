
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Panel from "./pages/Panel";
import Citas from "./pages/Citas";
import PlanillaHoras from "./pages/PlanillaHoras";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import UsersPage from "./pages/admin/UsersPage";
import AdminCitas from "./pages/admin/AdminCitas";

// Create a new QueryClient instance to manage queries
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/panel" element={
                  <ProtectedRoute>
                    <Panel />
                  </ProtectedRoute>
                } />
                <Route path="/citas" element={
                  <ProtectedRoute>
                    <Citas />
                  </ProtectedRoute>
                } />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }>
                  <Route index element={<AdminHome />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="citas" element={<AdminCitas />} />
                  <Route path="planilla-horas" element={<PlanillaHoras />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
