
import { DRStage } from "@/types";

export const drStages: DRStage[] = [
  {
    stage: 0,
    name: "No DR",
    description: "No abnormalities detected. The retina appears healthy with no visible signs of diabetic retinopathy.",
    color: "#34D399",
    colorClass: "bg-stage0"
  },
  {
    stage: 1,
    name: "Mild NPDR",
    description: "Mild Non-Proliferative Diabetic Retinopathy. Small areas of balloon-like swelling in the retina's tiny blood vessels.",
    color: "#FBBF24",
    colorClass: "bg-stage1"
  },
  {
    stage: 2,
    name: "Moderate NPDR",
    description: "Moderate Non-Proliferative Diabetic Retinopathy. As the disease progresses, some blood vessels that nourish the retina become blocked.",
    color: "#F97316",
    colorClass: "bg-stage2"
  },
  {
    stage: 3,
    name: "Severe NPDR",
    description: "Severe Non-Proliferative Diabetic Retinopathy. Many more blood vessels are blocked, depriving several areas of the retina of their blood supply.",
    color: "#EF4444",
    colorClass: "bg-stage3"
  },
  {
    stage: 4,
    name: "PDR",
    description: "Proliferative Diabetic Retinopathy. The most advanced stage where new, fragile blood vessels grow in response to the retina being deprived of oxygen.",
    color: "#DC2626",
    colorClass: "bg-stage4"
  }
];

export const detectRetinopathyStage = (imageUrl: string): Promise<{stage: number; diagnosis: string}> => {
  // In a real application, this would call an AI model to analyze the image
  // For this demo, we'll just return a random stage after a short delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomStage = Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4;
      const diagnosis = drStages[randomStage].description;
      resolve({ stage: randomStage, diagnosis });
    }, 2000);
  });
};
