"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { useCreateDoctor, useDeleteDoctor, useDoctors, useSpecializations, useUpdateDoctor } from "@/hooks/useDoctors";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate } from "@/lib/utils";
import { ApiClientError } from "@/lib/api";
import type { Doctor, DoctorInput } from "@/types/doctor";

const LIMIT = 10;

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useDoctors({
    search: debouncedSearch || undefined,
    specialization: specialization || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sort,
    page,
    limit: LIMIT,
  });
  const { data: specializations } = useSpecializations();

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor(editing?._id ?? "");
  const deleteDoctor = useDeleteDoctor();

  function resetFiltersPage() {
    setPage(1);
  }

  function handleCreate(values: DoctorInput) {
    createDoctor.mutate(values, {
      onSuccess: () => {
        toast.success("Doctor added");
        setCreateOpen(false);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to add doctor"),
    });
  }

  function handleUpdate(values: DoctorInput) {
    updateDoctor.mutate(values, {
      onSuccess: () => {
        toast.success("Doctor updated");
        setEditing(null);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to update doctor"),
    });
  }

  function handleDelete() {
    if (!deleting) return;
    deleteDoctor.mutate(deleting._id, {
      onSuccess: () => {
        toast.success("Doctor removed");
        setDeleting(null);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to delete doctor"),
    });
  }

  const doctors = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Doctors</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage doctor profiles and their patients</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialization, hospital..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetFiltersPage();
              }}
            />
          </div>
          <Select
            className="sm:w-48"
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
              resetFiltersPage();
            }}
          >
            <option value="">All specializations</option>
            {specializations?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              aria-label="From date"
              className="sm:w-40"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                resetFiltersPage();
              }}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              aria-label="To date"
              className="sm:w-40"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                resetFiltersPage();
              }}
            />
          </div>
          <Select
            className="sm:w-40"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as typeof sort);
              resetFiltersPage();
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name (A-Z)</option>
          </Select>
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : isError ? (
          <EmptyState icon={Stethoscope} title="Couldn't load doctors" description="Please try again in a moment." />
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description="Try adjusting your search or filters, or add a new doctor."
            action={
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Doctor
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Doctor</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Specialization</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Hospital</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Patients</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">Added</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="transition-colors hover:bg-primary-muted/30">
                    <td className="whitespace-nowrap px-5 py-3">
                      <Link href={`/doctors/${doctor._id}`} className="font-medium text-foreground hover:text-primary">
                        {doctor.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{doctor.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{doctor.specialization}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{doctor.hospital}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Badge tone="primary">{doctor.patientCount}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{formatDate(doctor.createdAt)}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing(doctor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleting(doctor)}>
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={setPage} />
        )}
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen} title="Add doctor" description="Create a new doctor profile">
        <DoctorForm onSubmit={handleCreate} submitting={createDoctor.isPending} submitLabel="Add doctor" />
      </Dialog>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)} title="Edit doctor">
        {editing && (
          <DoctorForm defaultValues={editing} onSubmit={handleUpdate} submitting={updateDoctor.isPending} submitLabel="Save changes" />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete doctor?"
        description={`This will also delete all patients under ${deleting?.name ?? "this doctor"}. This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteDoctor.isPending}
      />
    </div>
  );
}
