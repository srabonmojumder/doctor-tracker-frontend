"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DoctorInput } from "@/types/doctor";

const doctorSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  specialization: z.string().trim().min(2, "Specialization is required"),
  hospital: z.string().trim().min(2, "Hospital is required"),
  phone: z.string().trim().min(6, "Phone number looks too short"),
  email: z.string().trim().email("Invalid email"),
});

export function DoctorForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel = "Save doctor",
}: {
  defaultValues?: Partial<DoctorInput>;
  onSubmit: (values: DoctorInput) => void;
  submitting?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorInput>({
    resolver: zodResolver(doctorSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="Dr. Jane Doe" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" placeholder="Cardiology" {...register("specialization")} />
          {errors.specialization && <p className="mt-1 text-xs text-danger">{errors.specialization.message}</p>}
        </div>
        <div>
          <Label htmlFor="hospital">Hospital</Label>
          <Input id="hospital" placeholder="City General" {...register("hospital")} />
          {errors.hospital && <p className="mt-1 text-xs text-danger">{errors.hospital.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1-555-0100" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="doctor@hospital.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
