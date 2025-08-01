
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Eye, UserRound, Trash2 } from "lucide-react";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Patients: React.FC = () => {
  const { patients, scanResults, removePatient } = usePatient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  if (user?.role !== "doctor") {
    navigate("/dashboard");
    return null;
  }

  // Filter patients that belong to the current doctor
  const doctorPatients = patients.filter(patient => patient.doctor === user?.id);
  
  // Apply search filter
  const filteredPatients = doctorPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemovePatient = () => {
    if (patientToDelete) {
      removePatient(patientToDelete);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("/patients/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const patientScans = scanResults.filter(scan => scan.patientId === patient.id);
            const latestScan = patientScans.length > 0
              ? patientScans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
              : null;
              
            return (
              <div
                key={patient.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <UserRound className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                      </div>
                    </div>
                    {latestScan && (
                      <div
                        className={`w-3 h-3 rounded-full bg-stage${latestScan.stage}`}
                        title={`Latest scan: Stage ${latestScan.stage}`}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p>{patient.age}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="capitalize">{patient.gender}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Phone</p>
                      <p>{patient.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Scans</p>
                      <p className="text-lg font-semibold">{patientScans.length}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setPatientToDelete(patient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {patient.name}'s record and all associated scan results.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={handleRemovePatient}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {doctorPatients.length > 0
              ? "Try a different search term or clear your search"
              : "Add your first patient to get started"}
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/patients/add")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      )}
    </div>
  );
};

export default Patients;
