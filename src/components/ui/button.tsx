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
          "border-transparent bg-[#41A677] text-white shadow-sm hover:bg-[#318055] cursor-pointer",
        outline:
          "border-[#41A677] border-[1.5px] bg-transparent text-[#41A677] shadow-sm hover:bg-[#eafdf3] cursor-pointer",
        secondary:
          "border-transparent bg-[#1BA8A0] text-white shadow-sm hover:bg-[#0D7A75] cursor-pointer",
        ghost:
          "border-transparent bg-transparent text-[#41A677] hover:bg-[#eafdf3] cursor-pointer",
        destructive:
          "border-transparent bg-[#DC2626] text-white hover:bg-[#b91c1c] cursor-pointer",
        link: "border-transparent px-0 text-[#41A677] underline-offset-4 hover:underline",
        accent:
          "border-transparent bg-[#1BA8A0] text-white hover:bg-[#0D7A75] cursor-pointer",
        success:
          "border-transparent bg-[#41A677] text-white shadow-sm hover:bg-[#318055] cursor-pointer",
        orange:
          "border-transparent bg-[#f3b63f] text-white shadow-sm hover:bg-[#c47d00] cursor-pointer",
        neutral:
          "border-[#eeeeea] bg-[#f6f6f4] text-[#333333] hover:bg-[#eeeeea] cursor-pointer",
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
