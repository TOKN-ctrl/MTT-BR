import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />;
}

export function TabsTrigger({ className, active, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-colors",
        active ? "bg-background text-foreground shadow-sm" : "hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
