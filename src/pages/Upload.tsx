
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload as UploadIcon, Eye } from "lucide-react";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import { detectRetinopathyStage } from "@/utils/drStages";
import { useToast } from "@/components/ui/use-toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Upload: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { patients, addScanResult } = usePatient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();
  const { toast } = useToast();
  
  // Check for patientId in URL query params
  useEffect(() => {
    const patientId = query.get("patientId");
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  }, [query]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatientId || !selectedFile) {
      toast({
        title: "Error",
        description: "Please select a patient and upload an image",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the file to a server here
      // For now, we'll simulate a delay and then analyze the image
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Analyze the image using our (mock) AI model
      const result = await detectRetinopathyStage(previewUrl);
      
      // Add the result to our data and get the scan ID
      const scanResult = {
        patientId: selectedPatientId,
        imagePath: previewUrl,
        stage: result.stage as 0 | 1 | 2 | 3 | 4,
        diagnosis: result.diagnosis
      };
      
      const scanResultId = addScanResult(scanResult);
      console.log("Scan result added with ID:", scanResultId);
      
      // Make sure we have a valid ID before navigating
      if (scanResultId) {
        // Navigate to the results page
        navigate(`/results/${scanResultId}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate scan result ID",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the scan",
        variant: "destructive"
      });
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // Only doctors should access this page
  if (user?.role !== "doctor") {
    navigate("/dashboard");
    return null;
  }

  // Filter patients based on user role (only doctor's patients)
  const filteredPatients = patients.filter(p => p.doctor === user?.id);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Retinal Scan</CardTitle>
          <CardDescription>
            Upload a retinal image to detect signs of diabetic retinopathy
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patientId">Select Patient</Label>
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
              >
                <SelectTrigger id="patientId">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retinaImage">Retina Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="border rounded-lg p-4 h-60 flex flex-col items-center justify-center relative">
                    {previewUrl ? (
                      <div className="w-full h-full relative">
                        <img
                          src={previewUrl}
                          alt="Retina scan preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="retinaImage"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Click to upload</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          JPG, PNG or GIF (max. 10MB)
                        </span>
                      </label>
                    )}
                  </div>
                  <input
                    id="retinaImage"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="border rounded-lg p-4 h-60 flex flex-col items-center justify-center bg-muted/30">
                  <Eye className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-semibold">Retina Scan Guidelines</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>Use high-quality, clear images</li>
                    <li>Ensure proper lighting conditions</li>
                    <li>Center the retina in the image</li>
                    <li>Avoid glare or reflections</li>
                    <li>Image should show the full retina</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedPatientId || !selectedFile || isUploading || isAnalyzing}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload and Analyze
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Upload;
