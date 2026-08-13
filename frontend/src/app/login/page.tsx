"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Stethoscope, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuth";
import { ApiClientError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
        <Stethoscope className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">Doctor Tracker</span>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-6">
      <svg viewBox="0 0 500 500" className="w-full h-auto drop-shadow-2xl overflow-visible" fill="none">
        {/* Floating Line-Art Doodles */}
        <g stroke="rgba(255,255,255,0.45)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {/* Info Bubble (top left) */}
          <rect x="90" y="45" width="46" height="34" rx="8" />
          <line x1="113" y1="58" x2="113" y2="69" strokeWidth="2.5" />
          <circle cx="113" cy="53" r="1.25" fill="rgba(255,255,255,0.8)" />

          {/* Consultation Headset (top center) */}
          <path d="M220 40c-25 0-45 18-45 40v22" />
          <rect x="168" y="98" width="14" height="20" rx="4" />
          <path d="M280 40c25 0 45 18 45 40v22" />
          <rect x="318" y="98" width="14" height="20" rx="4" />

          {/* Speech Bubble (top right) */}
          <path d="M390 70c0 14-12 24-26 24h-6l-12 12v-12c-10 0-18-8-18-20s11-24 28-24 34 8 34 20z" />
          <circle cx="360" cy="70" r="2.5" fill="rgba(255,255,255,0.7)" />
          <circle cx="368" cy="70" r="2.5" fill="rgba(255,255,255,0.7)" />
          <circle cx="376" cy="70" r="2.5" fill="rgba(255,255,255,0.7)" />

          {/* 24 Circle Badge */}
          <circle cx="95" cy="150" r="22" />
          <text x="85" y="155" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
            24
          </text>

          {/* Phone Display */}
          <rect x="150" y="125" width="30" height="50" rx="6" />
          <path d="M160 142a5 5 0 0110 0v8" />

          {/* Laptop Display */}
          <rect x="215" y="125" width="46" height="30" rx="4" />
          <line x1="205" y1="155" x2="271" y2="155" />
          <path d="M233 138l10 10" />

          {/* Question mark */}
          <path d="M315 115c0-8 6-12 12-12s12 4 12 10c0 8-12 10-12 18M327 142v.01" />

          {/* Care Hand Icon */}
          <path d="M310 170h30c6 0 10 4 10 8s-4 8-10 8h-15" />

          {/* Cross & Dot Scatter Accents */}
          <circle cx="130" cy="100" r="3" />
          <circle cx="170" cy="75" r="4" fill="none" />
          <circle cx="340" cy="80" r="3" />
          <circle cx="370" cy="140" r="4" fill="none" />
          <path d="M125 115l6 6M131 115l-6 6" />
          <path d="M295 85l6 6M301 85l-6 6" />
          <path d="M345 105l6 6M351 105l-6 6" />
          <line x1="325" y1="65" x2="337" y2="65" />
          <line x1="140" y1="185" x2="152" y2="185" />
        </g>

        {/* Desktop Monitor Outer Shell */}
        <rect x="110" y="240" width="290" height="190" rx="16" fill="#140e29" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />

        {/* Screen Bezel Background */}
        <rect x="118" y="248" width="274" height="174" rx="10" fill="#1f163a" />

        {/* Avatar inside Screen */}
        <g>
          {/* Hair & Head Silhouette */}
          <path d="M250 165c-45 0-75 30-75 70 0 25 15 50 35 60v25h80v-25c20-10 35-35 35-60 0-40-30-70-75-70z" fill="#080415" />
          {/* Face */}
          <path d="M225 210c0 28 20 48 45 48s45-20 45-48h-90z" fill="#ffffff" />
          {/* Headset wire & Mic */}
          <path d="M235 215c-15-5-18-20 0-25M295 225l12 6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="311" cy="233" r="4" fill="#ffffff" />

          {/* Purple Coat/Shirt Body */}
          <path d="M185 285c0 0 25-15 65-15s65 15 65 15v135H185V285z" fill="#58419b" />
        </g>

        {/* OK Gesture Hand */}
        <g transform="translate(180, 220)">
          <path d="M25 60c-15-25-25-25-30 0s12 50 25 75" fill="#ffffff" />
          <circle cx="12" cy="78" r="8" fill="none" stroke="#080415" strokeWidth="3.5" />
        </g>

        {/* Monitor Stand */}
        <path d="M225 430v22h50v-22M185 464h130" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />

        {/* Checkmark Circle Badge (Left Side) */}
        <g transform="translate(80, 255)">
          <circle cx="32" cy="32" r="28" fill="#ffffff" />
          <circle cx="32" cy="32" r="35" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
          <path d="M21 32l8 8 16-16" stroke="#58419b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Wavy Horizontal Lines */}
        <path d="M410 305c12 6 18 6 30 0s18-6 30 0" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M85 365c12 6 18 6 30 0s18-6 30 0" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="100" />
        <path d="M395 425c12 6 18 6 30 0" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="85" y1="445" x2="235" y2="445" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@doctortracker.com",
      password: "ChangeMe123!",
    },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome back!");
        router.push(searchParams.get("next") || "/dashboard");
        router.refresh();
      },
      onError: (error) => {
        const message = error instanceof ApiClientError ? error.message : "Something went wrong";
        toast.error(message);
      },
    });
  });

  const setDemoCredentials = () => {
    setValue("email", "admin@doctortracker.com");
    setValue("password", "ChangeMe123!");
    toast.info("Demo admin credentials filled");
  };

  return (
    <div className="flex min-h-screen w-full bg-surface">
      {/* Left Panel - Form Container */}
      <div className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
        {/* Top Header Logo */}
        <div>
          <BrandLogo />
        </div>

        {/* Center Form Section */}
        <div className="my-auto w-full max-w-md py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Please enter your details</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@doctortracker.com"
                className="w-full h-11 sm:h-12 px-4 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                {...register("email")}
              />
              {errors.email && <p className="text-xs font-medium text-danger">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 sm:h-12 px-4 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                {...register("password")}
              />
              {errors.password && <p className="text-xs font-medium text-danger">{errors.password.message}</p>}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground/80 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Remember for 30 days
              </label>
              <button
                type="button"
                onClick={setDemoCredentials}
                className="text-xs text-muted-foreground hover:text-foreground underline decoration-dotted"
              >
                Use demo login
              </button>
            </div>

            {/* Sign in Primary Button */}
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-11 sm:h-12 mt-2 rounded-xl bg-[#5d43a6] hover:bg-[#4f3891] active:bg-[#44307e] text-white font-semibold text-sm shadow-md transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {login.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Admin Credentials Info Box */}
          <div className="mt-8 rounded-xl border border-border/80 bg-surface-muted/50 p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Administrative Portal Access
            </p>
            <p>
              Default Account: <span className="font-medium text-foreground">admin@doctortracker.com</span>
            </p>
            <p>
              Password: <span className="font-medium text-foreground">ChangeMe123!</span>
            </p>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="text-xs text-muted-foreground/60">
          Doctor Tracker &copy; {new Date().getFullYear()} &bull; Administrative Portal
        </div>
      </div>

      {/* Right Hero Artwork Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#9674d4] flex-col items-center justify-center relative overflow-hidden p-12">
        <HeroIllustration />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}


