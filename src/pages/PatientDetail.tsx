
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRound, Upload, ArrowLeft, FileText, CalendarIcon } from "lucide-react";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import { drStages } from "@/utils/drStages";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatient, getPatientScanResults, removePatient } = usePatient();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "doctor") {
    navigate("/dashboard");
    return null;
  }

  const patient = getPatient(id || "");
  const scanResults = getPatientScanResults(id || "");

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Patient not found</h3>
        <Button className="mt-4" onClick={() => navigate("/patients")}>
          Back to Patients
        </Button>
      </div>
    );
  }

  // Prepare data for the bar chart
  const chartData = [0, 1, 2, 3, 4].map(stage => {
    const count = scanResults.filter(s => s.stage === stage).length;
    return {
      stage: `Stage ${stage}`,
      count: count,
      fill: getStageColor(stage),
    };
  });

  // Helper function to get color for each stage
  function getStageColor(stage: number): string {
    switch(stage) {
      case 0: return "#22c55e"; // stage0
      case 1: return "#84cc16"; // stage1
      case 2: return "#eab308"; // stage2
      case 3: return "#f97316"; // stage3
      case 4: return "#ef4444"; // stage4
      default: return "#cbd5e1";
    }
  }

  const handleRemovePatient = () => {
    if (window.confirm(`Are you sure you want to remove ${patient.name}?`)) {
      removePatient(patient.id);
      navigate("/patients");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <UserRound className="h-12 w-12 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{patient.gender}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{patient.phoneNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="font-medium">{scanResults.length}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/upload?patientId=${patient.id}`)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New Scan
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleRemovePatient}
              >
                Remove Patient
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Retinal Scans</CardTitle>
            <CardDescription>Review patient's historical scan results</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Scan History</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="space-y-4 mt-4">
                {scanResults.length > 0 ? (
                  scanResults
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((scan) => (
                      <div key={scan.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{new Date(scan.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Stage {scan.stage}</span>
                            <div 
                              className={`w-3 h-3 rounded-full bg-stage${scan.stage}`} 
                              title={drStages[scan.stage].name}
                            />
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{scan.diagnosis}</p>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/results/${scan.id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Result
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">No scan results</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a retinal scan to get started
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(`/upload?patientId=${patient.id}`)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Scan
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="summary" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Retinopathy Stage Distribution</h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="stage" />
                          <YAxis allowDecimals={false} />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded p-2 shadow-md">
                                    <p className="font-medium">{payload[0].payload.stage}</p>
                                    <p className="text-sm">Count: {payload[0].value}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Latest Status</h3>
                    {scanResults.length > 0 ? (
                      (() => {
                        const latestScan = [...scanResults].sort(
                          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                        )[0];
                        
                        return (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div 
                                  className={`w-4 h-4 rounded-full bg-stage${latestScan.stage}`} 
                                />
                                <h4 className="font-semibold">
                                  Stage {latestScan.stage}: {drStages[latestScan.stage].name}
                                </h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {latestScan.diagnosis}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Last scan: {new Date(latestScan.date).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No scan results available yet.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail;
