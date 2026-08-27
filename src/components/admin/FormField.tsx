'use client';

import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children?: ReactNode;
}

export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <Label className={cn("text-xs font-mono font-medium tracking-wider uppercase", error && "text-destructive")}>
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground opacity-60">{hint}</span>}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  type?: 'text' | 'number' | 'password';
}

export function FormInput({ value, onChange, placeholder, error, type = 'text' }: FormInputProps) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(error && "border-destructive focus-visible:ring-destructive")}
    />
  );
}

interface FormTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextarea({ value, onChange, placeholder, error, rows = 4, className }: FormTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
    />
  );
}
