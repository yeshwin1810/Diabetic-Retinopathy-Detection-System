
export interface User {
  id: string;
  email: string;
  name: string;
  role: "doctor" | "patient";
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  doctor: string;
}

export interface ScanResult {
  id: string;
  patientId: string;
  imagePath: string;
  stage: 0 | 1 | 2 | 3 | 4;
  diagnosis: string;
  date: string;
}

export interface DRStage {
  stage: number;
  name: string;
  description: string;
  color: string;
  colorClass: string;
}
