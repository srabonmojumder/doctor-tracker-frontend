"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildQuery } from "@/lib/api";
import type { Doctor, DoctorInput, DoctorListParams } from "@/types/doctor";
import type { PageMeta, PaginatedResult } from "@/types/pagination";

function doctorsQueryKey(params: DoctorListParams) {
  return ["doctors", params] as const;
}

export function useDoctors(params: DoctorListParams) {
  return useQuery({
    queryKey: doctorsQueryKey(params),
    queryFn: async (): Promise<PaginatedResult<Doctor>> => {
      const qs = buildQuery({ ...params });
      const { data, meta } = await api.get<Doctor[]>(`/doctors${qs}`);
      return { items: data, meta: meta as unknown as PageMeta };
    },
    placeholderData: (prev) => prev,
  });
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: ["doctors", "detail", id],
    queryFn: () => api.get<Doctor>(`/doctors/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["doctors", "specializations"],
    queryFn: () => api.get<string[]>("/doctors/specializations").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorInput) => api.post<Doctor>("/doctors", input).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<DoctorInput>) => api.put<Doctor>(`/doctors/${id}`, input).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
