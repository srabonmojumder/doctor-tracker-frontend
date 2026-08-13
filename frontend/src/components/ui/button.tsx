import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_16px_-6px_rgba(37,99,235,0.45)] hover:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_20px_-6px_rgba(37,99,235,0.5)]",
  secondary: "bg-surface-muted text-foreground hover:bg-border/70",
  outline: "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-primary-muted/60 hover:text-primary",
  ghost: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
  danger:
    "bg-danger text-danger-foreground hover:brightness-110 active:brightness-95 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_16px_-6px_rgba(220,38,38,0.4)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  icon: "h-9 w-9",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
