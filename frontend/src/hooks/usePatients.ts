"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildQuery } from "@/lib/api";
import type { Patient, PatientInput, PatientListParams } from "@/types/patient";
import type { PageMeta, PaginatedResult } from "@/types/pagination";

export function usePatients(params: PatientListParams) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: async (): Promise<PaginatedResult<Patient>> => {
      const qs = buildQuery({ ...params });
      const { data, meta } = await api.get<Patient[]>(`/patients${qs}`);
      return { items: data, meta: meta as unknown as PageMeta };
    },
    placeholderData: (prev) => prev,
  });
}

export function useDoctorPatients(doctorId: string | undefined, params: PatientListParams) {
  return useQuery({
    queryKey: ["patients", "byDoctor", doctorId, params],
    queryFn: async (): Promise<PaginatedResult<Patient>> => {
      const qs = buildQuery({ ...params });
      const { data, meta } = await api.get<Patient[]>(`/doctors/${doctorId}/patients${qs}`);
      return { items: data, meta: meta as unknown as PageMeta };
    },
    enabled: Boolean(doctorId),
    placeholderData: (prev) => prev,
  });
}

export function useConditions() {
  return useQuery({
    queryKey: ["patients", "conditions"],
    queryFn: () => api.get<string[]>("/patients/conditions").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

function invalidatePatientQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["patients"] });
  queryClient.invalidateQueries({ queryKey: ["doctors"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreatePatientForDoctor(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientInput) => api.post<Patient>(`/doctors/${doctorId}/patients`, input).then((r) => r.data),
    onSuccess: () => invalidatePatientQueries(queryClient),
  });
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<PatientInput>) => api.put<Patient>(`/patients/${id}`, input).then((r) => r.data),
    onSuccess: () => invalidatePatientQueries(queryClient),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: () => invalidatePatientQueries(queryClient),
  });
}
