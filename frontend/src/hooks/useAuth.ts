"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface AdminSession {
  id: string;
  email: string;
}

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get<AdminSession>("/auth/me").then((r) => r.data),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      api.post<AdminSession>("/auth/login", input).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
