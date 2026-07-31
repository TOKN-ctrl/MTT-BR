import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", {
  defaultVariants: { variant: "default" },
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      destructive: "border-transparent bg-destructive text-white",
      outline: "border-border text-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
      warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    },
  },
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
