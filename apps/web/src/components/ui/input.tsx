import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-archive">{label}</label>
        )}
        <input
          ref={ref}
          className={`h-10 rounded-[var(--radius-sm)] border border-archive/15 bg-white px-3 text-sm outline-none focus:border-signal focus:ring-1 focus:ring-signal/20 ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
