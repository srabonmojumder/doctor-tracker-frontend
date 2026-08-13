export type PatientGender = "male" | "female" | "other";

export interface PatientDoctorRef {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  condition: string;
  phone: string;
  address: string;
  doctor: PatientDoctorRef;
  createdAt: string;
  updatedAt: string;
}

export interface PatientInput {
  name: string;
  age: number;
  gender: PatientGender;
  condition: string;
  phone: string;
  address: string;
}

export interface PatientListParams {
  search?: string;
  condition?: string;
  doctor?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "name";
}
