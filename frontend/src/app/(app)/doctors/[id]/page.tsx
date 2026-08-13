"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Pencil, Phone, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { PatientForm } from "@/components/patients/patient-form";
import { PatientsTable } from "@/components/patients/patients-table";
import { useDeleteDoctor, useDoctor, useUpdateDoctor } from "@/hooks/useDoctors";
import { useCreatePatientForDoctor, useDeletePatient, useDoctorPatients, useUpdatePatient } from "@/hooks/usePatients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate, initials } from "@/lib/utils";
import { ApiClientError } from "@/lib/api";
import type { DoctorInput } from "@/types/doctor";
import type { Patient, PatientInput } from "@/types/patient";

const LIMIT = 8;

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>();
  const doctorId = params.id;
  const router = useRouter();

  const { data: doctor, isLoading: doctorLoading } = useDoctor(doctorId);
  const updateDoctor = useUpdateDoctor(doctorId);
  const deleteDoctor = useDeleteDoctor();

  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [deleteDoctorOpen, setDeleteDoctorOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading: patientsLoading } = useDoctorPatients(doctorId, {
    search: debouncedSearch || undefined,
    page,
    limit: LIMIT,
  });

  const createPatient = useCreatePatientForDoctor(doctorId);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const updatePatient = useUpdatePatient(editingPatient?._id ?? "");
  const deletePatient = useDeletePatient();

  function handleUpdateDoctor(values: DoctorInput) {
    updateDoctor.mutate(values, {
      onSuccess: () => {
        toast.success("Doctor updated");
        setEditDoctorOpen(false);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to update doctor"),
    });
  }

  function handleDeleteDoctor() {
    deleteDoctor.mutate(doctorId, {
      onSuccess: () => {
        toast.success("Doctor removed");
        router.push("/doctors");
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to delete doctor"),
    });
  }

  function handleAddPatient(values: PatientInput) {
    createPatient.mutate(values, {
      onSuccess: () => {
        toast.success("Patient added");
        setAddPatientOpen(false);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to add patient"),
    });
  }

  function handleUpdatePatient(values: PatientInput) {
    updatePatient.mutate(values, {
      onSuccess: () => {
        toast.success("Patient updated");
        setEditingPatient(null);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to update patient"),
    });
  }

  function handleDeletePatient() {
    if (!deletingPatient) return;
    deletePatient.mutate(deletingPatient._id, {
      onSuccess: () => {
        toast.success("Patient removed");
        setDeletingPatient(null);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to delete patient"),
    });
  }

  const patients = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <Link href="/doctors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to doctors
      </Link>

      {doctorLoading || !doctor ? (
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-muted text-lg font-semibold text-primary">
                {initials(doctor.name)}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{doctor.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{doctor.specialization}</Badge>
                  <span className="text-sm text-muted-foreground">{doctor.hospital}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {doctor.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {doctor.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {doctor.patientCount} patients
                  </span>
                  <span>Added {formatDate(doctor.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditDoctorOpen(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteDoctorOpen(true)}>
                <Trash2 className="h-4 w-4 text-danger" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Patients</h2>
            <p className="text-xs text-muted-foreground">Patients under this doctor&apos;s care</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="w-56 pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button size="sm" onClick={() => setAddPatientOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        {patientsLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients yet"
            description="Add the first patient under this doctor."
            action={
              <Button size="sm" onClick={() => setAddPatientOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            }
          />
        ) : (
          <PatientsTable patients={patients} onEdit={setEditingPatient} onDelete={setDeletingPatient} />
        )}

        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={setPage} />
        )}
      </Card>

      <Dialog open={editDoctorOpen} onOpenChange={setEditDoctorOpen} title="Edit doctor">
        {doctor && (
          <DoctorForm defaultValues={doctor} onSubmit={handleUpdateDoctor} submitting={updateDoctor.isPending} submitLabel="Save changes" />
        )}
      </Dialog>

      <ConfirmDialog
        open={deleteDoctorOpen}
        onOpenChange={setDeleteDoctorOpen}
        title="Delete doctor?"
        description="This will also delete all patients under this doctor. This action cannot be undone."
        onConfirm={handleDeleteDoctor}
        loading={deleteDoctor.isPending}
      />

      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen} title="Add patient" description="Add a new patient under this doctor">
        <PatientForm onSubmit={handleAddPatient} submitting={createPatient.isPending} submitLabel="Add patient" />
      </Dialog>

      <Dialog open={Boolean(editingPatient)} onOpenChange={(open) => !open && setEditingPatient(null)} title="Edit patient">
        {editingPatient && (
          <PatientForm
            defaultValues={editingPatient}
            onSubmit={handleUpdatePatient}
            submitting={updatePatient.isPending}
            submitLabel="Save changes"
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingPatient)}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        title="Remove patient?"
        description={`This will remove ${deletingPatient?.name ?? "this patient"} from the doctor's patient list.`}
        onConfirm={handleDeletePatient}
        loading={deletePatient.isPending}
      />
    </div>
  );
}
