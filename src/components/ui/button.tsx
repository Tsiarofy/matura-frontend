import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-pill)] border font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-sm hover:opacity-92",
        outline:
          "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] shadow-sm hover:bg-[var(--color-surface-soft)]",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] hover:bg-[#ecece8]",
        ghost:
          "border-transparent bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]",
        destructive:
          "border-[var(--color-error-border)] bg-[var(--color-error)] text-white hover:opacity-90",
        link: "border-transparent px-0 text-[var(--color-text-primary)] underline-offset-4 hover:underline",
        accent:
          "border-[var(--color-border)] bg-[var(--color-accent-bg)] text-[var(--color-text-primary)] hover:bg-[#e9e9e6]",
        success:
          "border-[var(--color-success-border)] bg-[var(--color-success)] text-white shadow-sm hover:brightness-[0.98]",
        orange:
          "border-secondary-orange-border bg-secondary-orange text-white shadow-sm hover:brightness-[0.98]",
      },
      size: {
        default: "h-10 px-4 text-[12px] gap-2",
        sm: "h-8 px-3 text-[11px] gap-1.5 rounded-[var(--radius-pill)]",
        lg: "h-11 px-5 text-[13px] gap-2.5 rounded-[var(--radius-pill)]",
        icon: "size-11 rounded-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
