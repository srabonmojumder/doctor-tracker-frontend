import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/types/patient";

const GENDER_LABEL: Record<Patient["gender"], string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export function PatientsTable({
  patients,
  showDoctor = false,
  onEdit,
  onDelete,
}: {
  patients: Patient[];
  showDoctor?: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <th className="whitespace-nowrap px-5 py-3 font-medium">Patient</th>
            <th className="whitespace-nowrap px-5 py-3 font-medium">Condition</th>
            {showDoctor && <th className="whitespace-nowrap px-5 py-3 font-medium">Doctor</th>}
            <th className="whitespace-nowrap px-5 py-3 font-medium">Contact</th>
            <th className="whitespace-nowrap px-5 py-3 font-medium">Added</th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {patients.map((patient) => (
            <tr key={patient._id} className="transition-colors hover:bg-primary-muted/30">
              <td className="whitespace-nowrap px-5 py-3">
                <p className="font-medium text-foreground">{patient.name}</p>
                <p className="text-xs text-muted-foreground">
                  {patient.age} yrs &middot; {GENDER_LABEL[patient.gender]}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-3">
                <Badge tone="accent">{patient.condition}</Badge>
              </td>
              {showDoctor && (
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                  {patient.doctor ? (
                    <Link href={`/doctors/${patient.doctor._id}`} className="hover:text-primary">
                      {patient.doctor.name}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
              )}
              <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{patient.phone}</td>
              <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{formatDate(patient.createdAt)}</td>
              <td className="whitespace-nowrap px-5 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => onEdit(patient)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => onDelete(patient)}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
