
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Share2, Eye } from "lucide-react";
import { usePatient } from "@/contexts/PatientContext";
import { drStages } from "@/utils/drStages";
import { useToast } from "@/components/ui/use-toast";

const ScanResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getScanResult, getPatient } = usePatient();
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [scanResult, setScanResult] = useState<ReturnType<typeof getScanResult>>(undefined);
  
  useEffect(() => {
    if (id) {
      console.log("Fetching scan result with ID:", id);
      const result = getScanResult(id);
      console.log("Scan result found:", result);
      setScanResult(result);
      
      if (!result) {
        toast({
          title: "Error",
          description: "Scan result not found. The ID may be invalid.",
          variant: "destructive"
        });
      }
    }
    setIsLoading(false);
  }, [id, getScanResult, toast]);
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Loading scan result...</h3>
      </div>
    );
  }
  
  if (!scanResult) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Scan result not found</h3>
        <p className="text-muted-foreground mt-2">The scan result you're looking for doesn't exist or may have been deleted.</p>
        <Button className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const patient = getPatient(scanResult.patientId);
  const stageInfo = drStages[scanResult.stage];
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="print:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Scan Result</h1>
      </div>
      
      <Card className="overflow-hidden">
        <div className={`h-2 ${stageInfo.colorClass}`} />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Diabetic Retinopathy Analysis</CardTitle>
              <CardDescription>
                Results for {patient?.name} (ID: {patient?.id})
              </CardDescription>
            </div>
            <div className="text-right print:hidden">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(scanResult.date).toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/10">
              <img
                src={scanResult.imagePath || "/placeholder.svg"}
                alt="Retina scan"
                className="max-h-80 object-contain"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
                <Card className="bg-muted/5">
                  <CardContent className="p-4">
                    <p className="text-sm">{scanResult.diagnosis}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Stage Assessment</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className={`p-3 text-white font-medium flex items-center ${stageInfo.colorClass}`}>
                    <Eye className="h-5 w-5 mr-2" />
                    Stage {scanResult.stage}: {stageInfo.name}
                  </div>
                  <div className="p-4 text-sm">
                    <p>{stageInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4 print:hidden">
            <div>
              <p className="text-sm text-muted-foreground">Scan ID: {scanResult.id}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
                <Printer className="h-4 w-4 mr-2" />
                {isPrinting ? "Preparing..." : "Print"}
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>This analysis is provided for informational purposes only.</p>
        <p>Always consult with a qualified healthcare provider for proper diagnosis and treatment.</p>
      </div>
    </div>
  );
};

export default ScanResult;
