export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  patientCount: number;
}

export interface DoctorInput {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface DoctorListParams {
  search?: string;
  specialization?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "name";
}
