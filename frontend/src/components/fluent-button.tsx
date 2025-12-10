import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden rounded-lg cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.98]",
    outline:
      "bg-background text-foreground border border-border hover:bg-muted hover:border-foreground/20 active:scale-[0.98]",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
};