import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-archive/8 bg-white p-5 ${className}`}
    >
      {children}
    </div>
  );
}
