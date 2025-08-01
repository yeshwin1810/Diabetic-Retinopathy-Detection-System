
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { drStages } from "@/utils/drStages";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-[800px] mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Diabetic Retinopathy Detection System
            </h1>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Early detection of diabetic retinopathy is crucial for preventing vision loss.
              Our AI-powered system helps identify the stage of diabetic retinopathy from retinal images.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-4">
              {user ? (
                <Button size="lg" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate("/login")}>
                    Doctor Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Understanding Diabetic Retinopathy
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                The Five Stages of Diabetic Retinopathy
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Diabetic retinopathy typically progresses through five stages. Understanding these stages can
                help in early detection and treatment.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {drStages.map((stage) => (
              <Card key={stage.stage} className="overflow-hidden border-none shadow-md">
                <div className={`h-2 ${stage.colorClass}`} />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">Stage {stage.stage}: {stage.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{stage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <div className="text-center text-sm text-muted-foreground py-8">
        <p>This system is for medical professionals only.</p>
        <p>If you are a patient, please consult with your healthcare provider.</p>
      </div>
    </div>
  );
};

export default Index;
