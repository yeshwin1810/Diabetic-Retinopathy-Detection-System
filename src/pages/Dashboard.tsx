
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Users, Upload, FileText, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, scanResults } = usePatient();
  const navigate = useNavigate();

  // Check if user is a doctor
  const isDoctor = user?.role === "doctor";
  
  // If not a doctor, redirect to login
  if (!isDoctor) {
    navigate("/login");
    return null;
  }
  
  // Filter data based on user role (only doctor's patients)
  const filteredPatients = patients.filter(p => p.doctor === user?.id);
  const filteredScanResults = scanResults.filter(s => 
    filteredPatients.some(p => p.id === s.patientId)
  );

  const recentScans = [...filteredScanResults].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/patients/add")} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
          <Button onClick={() => navigate("/upload")} size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Scan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredScanResults.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredScanResults.length > 0 
                ? `Last scan on ${new Date(filteredScanResults[filteredScanResults.length - 1].date).toLocaleDateString()}`
                : "No scans yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              Managing {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scan Distribution</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3, 4].map((stage) => {
                const count = filteredScanResults.filter(s => s.stage === stage).length;
                const percentage = filteredScanResults.length > 0 
                  ? Math.round((count / filteredScanResults.length) * 100) 
                  : 0;
                
                return (
                  <div 
                    key={stage} 
                    className={`h-16 flex-1 rounded-sm flex flex-col items-center justify-end relative bg-stage${stage}/20`}
                  >
                    <div 
                      className={`w-full bg-stage${stage} rounded-sm absolute bottom-0`} 
                      style={{ height: `${percentage}%` }}
                    />
                    <span className="text-xs font-medium relative z-10 mb-1 text-foreground">{stage}</span>
                    <span className="text-xs relative z-10 mb-1 text-foreground">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Distribution of DR stages across all scans
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your patients' most recent retina scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentScans.length > 0 ? (
              <div className="space-y-4">
                {recentScans.map((scan) => {
                  const patient = patients.find(p => p.id === scan.patientId);
                  return (
                    <div key={scan.id} className="flex items-center space-x-4">
                      <div className={`w-2 h-14 rounded bg-stage${scan.stage}`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{patient?.name} ({patient?.id})</p>
                        <p className="text-xs text-muted-foreground">
                          Stage {scan.stage}: {scan.diagnosis.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/results/${scan.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No scan results available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
