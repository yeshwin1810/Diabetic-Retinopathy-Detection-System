
import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, ScanResult } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface PatientContextType {
  patients: Patient[];
  scanResults: ScanResult[];
  addPatient: (patient: Omit<Patient, "id">) => string;
  getPatient: (id: string) => Patient | undefined;
  removePatient: (id: string) => void;
  addScanResult: (scanResult: Omit<ScanResult, "id" | "date">) => string;
  getPatientScanResults: (patientId: string) => ScanResult[];
  getScanResult: (id: string) => ScanResult | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Mock data
const mockPatients: Patient[] = [
  { id: "P001", name: "John Doe", age: 45, gender: "male", phoneNumber: "555-1234", doctor: "1" },
  { id: "P002", name: "Jane Smith", age: 52, gender: "female", phoneNumber: "555-5678", doctor: "1" },
];

const mockScanResults: ScanResult[] = [
  { 
    id: "S001", 
    patientId: "P001", 
    imagePath: "/placeholder.svg", 
    stage: 2, 
    diagnosis: "Moderate NPDR detected. Some blood vessels that nourish the retina are blocked.", 
    date: "2025-04-10" 
  },
];

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [scanResults, setScanResults] = useState<ScanResult[]>(mockScanResults);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const savedPatients = localStorage.getItem("patients");
    const savedScanResults = localStorage.getItem("scanResults");
    
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    } else {
      localStorage.setItem("patients", JSON.stringify(mockPatients));
    }
    
    if (savedScanResults) {
      setScanResults(JSON.parse(savedScanResults));
    } else {
      localStorage.setItem("scanResults", JSON.stringify(mockScanResults));
    }
  }, []);

  const addPatient = (patientData: Omit<Patient, "id">) => {
    // Generate a new patient ID (format: P + 3-digit number)
    const newId = `P${String(patients.length + 1).padStart(3, '0')}`;
    
    const newPatient: Patient = {
      ...patientData,
      id: newId
    };
    
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
    
    toast({
      title: "Patient Added",
      description: `Patient ${newPatient.name} has been added with ID: ${newId}`,
    });
    
    return newId;
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const removePatient = (id: string) => {
    const patient = getPatient(id);
    if (!patient) return;
    
    // Remove the patient
    const updatedPatients = patients.filter(p => p.id !== id);
    setPatients(updatedPatients);
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
    
    // Remove associated scan results
    const updatedScanResults = scanResults.filter(scan => scan.patientId !== id);
    setScanResults(updatedScanResults);
    localStorage.setItem("scanResults", JSON.stringify(updatedScanResults));
    
    toast({
      title: "Patient Removed",
      description: `Patient ${patient.name} has been removed from your records`,
    });
  };

  const addScanResult = (scanResultData: Omit<ScanResult, "id" | "date">) => {
    // Generate a new scan ID (format: S + 3-digit number)
    const newId = `S${String(scanResults.length + 1).padStart(3, '0')}`;
    
    const newScanResult: ScanResult = {
      ...scanResultData,
      id: newId,
      date: new Date().toISOString().split('T')[0]
    };
    
    console.log("Created new scan result:", newScanResult);
    
    const updatedScanResults = [...scanResults, newScanResult];
    setScanResults(updatedScanResults);
    localStorage.setItem("scanResults", JSON.stringify(updatedScanResults));
    
    toast({
      title: "Scan Result Added",
      description: `New scan result has been added for patient ${scanResultData.patientId}`,
    });
    
    return newId;
  };

  const getPatientScanResults = (patientId: string) => {
    return scanResults.filter(result => result.patientId === patientId);
  };

  const getScanResult = (id: string) => {
    console.log("Looking for scan result with ID:", id);
    console.log("Available scan results:", scanResults);
    return scanResults.find(result => result.id === id);
  };

  return (
    <PatientContext.Provider value={{ 
      patients, 
      scanResults, 
      addPatient, 
      getPatient,
      removePatient,
      addScanResult, 
      getPatientScanResults,
      getScanResult
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
