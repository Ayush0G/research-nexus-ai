import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "signal" | "discovery" | "evidence" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-archive/5 text-archive",
    signal: "bg-signal/10 text-signal",
    discovery: "bg-discovery/10 text-discovery",
    evidence: "bg-evidence/10 text-evidence",
    success: "bg-success/10 text-success",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
