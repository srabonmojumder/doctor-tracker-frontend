"use client";

import { Activity, Stethoscope, Users, UserRound, TrendingUp, Award, HeartPulse, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RegistrationsChart } from "@/components/dashboard/registrations-chart";
import { DistributionBarChart } from "@/components/dashboard/distribution-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardStats } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isError) {
    return <EmptyState icon={Activity} title="Couldn't load dashboard" description="Please try again in a moment." />;
  }

  return (
    <div className="space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Executive Dashboard</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Data
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time metric insights across doctors, patients, and registrations
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-2xl" />)
        ) : (
          <>
            <StatCard
              label="Total Doctors"
              value={stats.totalDoctors.toLocaleString()}
              icon={Stethoscope}
              tone="primary"
              badge="Medical Team"
            />
            <StatCard
              label="Total Patients"
              value={stats.totalPatients.toLocaleString()}
              icon={Users}
              tone="accent"
              badge="Registered"
            />
            <StatCard
              label="Avg. Patients / Doctor"
              value={stats.avgPatientsPerDoctor.toLocaleString()}
              icon={UserRound}
              tone="warning"
              badge="Patient Load"
            />
            <StatCard
              label="Specializations"
              value={stats.specializationDistribution.length.toLocaleString()}
              icon={Award}
              tone="purple"
              badge="Departments"
            />
          </>
        )}
      </div>

      {/* Registrations Chart */}
      <Card className="overflow-hidden border border-border/80 shadow-soft">
        <CardHeader className="border-b border-border/40 bg-surface-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Registration Trends</CardTitle>
                <p className="text-xs text-muted-foreground">Doctor and patient registrations over the last 30 days</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-surface px-3 py-1 rounded-full border border-border">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> 30-Day Window
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading || !stats ? (
            <Skeleton className="h-[280px] rounded-xl" />
          ) : (
            <RegistrationsChart data={stats.registrationsByDate} />
          )}
        </CardContent>
      </Card>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border border-border/80 shadow-soft">
          <CardHeader className="border-b border-border/40 bg-surface-muted/30 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patients Per Doctor</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution of assigned patients per medical staff member</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading || !stats ? (
              <Skeleton className="h-[220px] rounded-xl" />
            ) : stats.patientsPerDoctor.length === 0 ? (
              <EmptyState icon={Users} title="No patients assigned yet" />
            ) : (
              <DistributionBarChart
                data={stats.patientsPerDoctor.map((d) => ({ label: d.doctorName, value: d.count }))}
                color="var(--chart-1)"
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/80 shadow-soft">
          <CardHeader className="border-b border-border/40 bg-surface-muted/30 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Doctors by Specialization</CardTitle>
                <p className="text-xs text-muted-foreground">Breakdown of medical staff across clinical specialties</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading || !stats ? (
              <Skeleton className="h-[220px] rounded-xl" />
            ) : stats.specializationDistribution.length === 0 ? (
              <EmptyState icon={Stethoscope} title="No doctors registered yet" />
            ) : (
              <DistributionBarChart
                data={stats.specializationDistribution.map((d) => ({ label: d.specialization, value: d.count }))}
                color="var(--chart-2)"
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/80 shadow-soft lg:col-span-2">
          <CardHeader className="border-b border-border/40 bg-surface-muted/30 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Patients by Condition</CardTitle>
                <p className="text-xs text-muted-foreground">Prevalence of active medical conditions across all patients</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading || !stats ? (
              <Skeleton className="h-[220px] rounded-xl" />
            ) : stats.conditionDistribution.length === 0 ? (
              <EmptyState icon={Activity} title="No condition data available" />
            ) : (
              <DistributionBarChart
                data={stats.conditionDistribution.map((d) => ({ label: d.condition, value: d.count }))}
                color="var(--chart-3)"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

