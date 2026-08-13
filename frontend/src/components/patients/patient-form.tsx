"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { PatientInput } from "@/types/patient";

const patientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(0, "Invalid age").max(130, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  condition: z.string().trim().min(2, "Condition is required"),
  phone: z.string().trim().min(6, "Phone number looks too short"),
  address: z.string().trim().min(2, "Address is required"),
});

export function PatientForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel = "Save patient",
}: {
  defaultValues?: Partial<PatientInput>;
  onSubmit: (values: PatientInput) => void;
  submitting?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: { gender: "male", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="John Smith" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" min={0} max={130} {...register("age", { valueAsNumber: true })} />
          {errors.age && <p className="mt-1 text-xs text-danger">{errors.age.message}</p>}
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Input id="condition" placeholder="Hypertension" {...register("condition")} />
        {errors.condition && <p className="mt-1 text-xs text-danger">{errors.condition.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1-555-0100" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="123 Main St" {...register("address")} />
          {errors.address && <p className="mt-1 text-xs text-danger">{errors.address.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
