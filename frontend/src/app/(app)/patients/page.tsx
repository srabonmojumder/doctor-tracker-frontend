"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SelectMenu } from "@/components/ui/select-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { PatientForm } from "@/components/patients/patient-form";
import { PatientsTable } from "@/components/patients/patients-table";
import { useConditions, useDeletePatient, usePatients, useUpdatePatient } from "@/hooks/usePatients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiClientError } from "@/lib/api";
import type { Patient, PatientInput } from "@/types/patient";

const LIMIT = 10;

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [page, setPage] = useState(1);

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = usePatients({
    search: debouncedSearch || undefined,
    condition: condition || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sort,
    page,
    limit: LIMIT,
  });
  const { data: conditions } = useConditions();

  const updatePatient = useUpdatePatient(editingPatient?._id ?? "");
  const deletePatient = useDeletePatient();

  function resetPage() {
    setPage(1);
  }

  function handleUpdate(values: PatientInput) {
    updatePatient.mutate(values, {
      onSuccess: () => {
        toast.success("Patient updated");
        setEditingPatient(null);
      },
      onError: (error) => toast.error(error instanceof ApiClientError ? error.message : "Failed to update patient"),
    });
  }

  function handleDelete() {
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Patients</h1>
        <p className="mt-1 text-sm text-muted-foreground">All patients across every doctor</p>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or condition..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </div>
          <SelectMenu
            className="sm:w-48"
            value={condition}
            onValueChange={(value) => {
              setCondition(value);
              resetPage();
            }}
            options={[
              { value: "", label: "All conditions" },
              ...(conditions?.map((c) => ({ value: c, label: c })) ?? []),
            ]}
          />
          <div className="flex items-center gap-2">
            <DatePicker
              aria-label="From date"
              className="sm:w-40"
              placeholder="From date"
              value={dateFrom}
              onChange={(value) => {
                setDateFrom(value);
                resetPage();
              }}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <DatePicker
              aria-label="To date"
              className="sm:w-40"
              placeholder="To date"
              value={dateTo}
              onChange={(value) => {
                setDateTo(value);
                resetPage();
              }}
            />
          </div>
          <SelectMenu
            className="sm:w-40"
            value={sort}
            onValueChange={(value) => {
              setSort(value as typeof sort);
              resetPage();
            }}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "name", label: "Name (A-Z)" },
            ]}
          />
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : isError ? (
          <EmptyState icon={Users} title="Couldn't load patients" description="Please try again in a moment." />
        ) : patients.length === 0 ? (
          <EmptyState icon={Users} title="No patients found" description="Try adjusting your search or filters." />
        ) : (
          <PatientsTable patients={patients} showDoctor onEdit={setEditingPatient} onDelete={setDeletingPatient} />
        )}

        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={setPage} />
        )}
      </Card>

      <Dialog open={Boolean(editingPatient)} onOpenChange={(open) => !open && setEditingPatient(null)} title="Edit patient">
        {editingPatient && (
          <PatientForm
            defaultValues={editingPatient}
            onSubmit={handleUpdate}
            submitting={updatePatient.isPending}
            submitLabel="Save changes"
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingPatient)}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        title="Delete patient?"
        description={`This will permanently delete ${deletingPatient?.name ?? "this patient"}.`}
        onConfirm={handleDelete}
        loading={deletePatient.isPending}
      />
    </div>
  );
}
