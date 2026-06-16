import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  error?: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}

export function FormField({ 
  label, 
  error, 
  hint, 
  htmlFor, 
  children, 
  className,
  ...props 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Label 
        htmlFor={htmlFor} 
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error ? "text-destructive" : ""
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement, { error: !!error } as React.HTMLAttributes<HTMLElement>);
          }
          return child;
        })}
      </div>
      
      {error && (
        <p className="text-sm font-medium text-destructive flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-[0.8rem] text-muted-foreground mt-1">
          {hint}
        </p>
      )}
    </div>
  )
}
