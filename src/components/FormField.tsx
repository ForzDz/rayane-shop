import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChangeEvent, FocusEvent } from "react";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Composant FormField réutilisable
 * Mobile-first avec labels flottants et validation inline
 */
export const FormField = ({
  id,
  name,
  label,
  type = "text",
  value,
  error,
  touched,
  required = false,
  placeholder,
  autoComplete,
  multiline = false,
  rows = 4,
  onChange,
  onBlur,
}: FormFieldProps) => {
  const hasError = touched && error;
  const inputId = `form-field-${id}`;

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={inputId}
        className={cn(
          "text-sm font-medium transition-colors",
          hasError ? "text-destructive" : "text-foreground"
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      {multiline ? (
        <Textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          required={required}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={cn(
            "w-full min-h-[120px] resize-y transition-colors",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={cn(
            "w-full h-12 transition-colors",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
        />
      )}
      
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-destructive animate-fade-in"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};
