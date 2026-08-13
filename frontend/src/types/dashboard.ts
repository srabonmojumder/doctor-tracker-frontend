export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: number;
  patientsPerDoctor: { doctorId: string; doctorName: string; count: number }[];
  specializationDistribution: { specialization: string; count: number }[];
  conditionDistribution: { condition: string; count: number }[];
  registrationsByDate: { date: string; doctors: number; patients: number }[];
}
