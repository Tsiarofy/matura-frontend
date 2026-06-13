import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[18px] border border-[var(--color-border-input)] bg-[var(--color-surface-input)] px-4 py-2 text-[13px] text-[var(--color-text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[border-color,background-color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--color-text-placeholder)] focus-visible:border-[var(--color-border-strong)] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[color:rgba(25,180,91,0.10)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15",
        className,
      )}
      {...props}
    />
  );
}

function SearchInput({
  className,
  containerClassName,
  onClear,
  value,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  containerClassName?: string;
  onClear?: () => void;
  value?: string;
}) {
  const showClear = Boolean(
    onClear && typeof value === "string" && value.length > 0,
  );

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
        <Search
          size={14}
          strokeWidth={1.25}
          className="text-[var(--color-text-placeholder)]"
        />
      </div>

      <input
        type="text"
        data-slot="search-input"
        value={value}
        className={cn(
          "h-[34px] w-full rounded-[999px] border border-[var(--color-border)] bg-white pl-8 pr-8 text-[11.5px] text-[var(--color-text-secondary)] outline-none transition-[border-color,background-color,box-shadow]",
          "placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-border-strong)] focus:ring-2 focus:ring-[color:rgba(25,180,91,0.06)]",
          className,
        )}
        {...props}
      />

      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[var(--color-text-placeholder)] transition-colors hover:text-[var(--color-text-primary)]"
          aria-label="Effacer la recherche"
        >
          <X size={14} strokeWidth={1.25} />
        </button>
      )}
    </div>
  );
}

export { Input, SearchInput };
