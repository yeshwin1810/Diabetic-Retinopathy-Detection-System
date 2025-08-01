
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetail from "./pages/PatientDetail";
import Upload from "./pages/Upload";
import ScanResult from "./pages/ScanResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Doctor-only route component
const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "doctor") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patients" 
        element={
          <DoctorRoute>
            <Patients />
          </DoctorRoute>
        } 
      />
      
      <Route 
        path="/patients/add" 
        element={
          <DoctorRoute>
            <AddPatient />
          </DoctorRoute>
        } 
      />
      
      <Route 
        path="/patients/:id" 
        element={
          <DoctorRoute>
            <PatientDetail />
          </DoctorRoute>
        } 
      />
      
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/results/:id" 
        element={
          <ProtectedRoute>
            <ScanResult />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PatientProvider>
          <BrowserRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </PatientProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
