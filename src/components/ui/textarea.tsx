import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-[22px] border border-[var(--color-border-input)] bg-[var(--color-surface-input)] px-4 py-3.5 text-[13px] text-[var(--color-text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[border-color,background-color,box-shadow] outline-none placeholder:text-[var(--color-text-placeholder)] focus-visible:border-[var(--color-border-strong)] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[color:rgba(25,180,91,0.10)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
