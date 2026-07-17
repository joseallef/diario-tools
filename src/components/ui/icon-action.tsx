"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconActionVariant = "default" | "accent" | "danger" | "muted";

const variantClass: Record<IconActionVariant, string> = {
  default:
    "text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm hover:ring-1 hover:ring-primary/20",
  accent:
    "border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:shadow-md hover:ring-2 hover:ring-primary/30",
  danger:
    "text-red-600 hover:bg-red-500 hover:text-white hover:shadow-sm hover:ring-1 hover:ring-red-500/30",
  muted:
    "text-muted-foreground hover:bg-muted hover:text-foreground hover:ring-1 hover:ring-border",
};

type IconActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  /** Extra line under the label (shortcuts, tips) */
  hint?: string;
  variant?: IconActionVariant;
  side?: "top" | "bottom" | "left" | "right";
  /** Larger hit target without changing visual size much */
  size?: "sm" | "md";
};

/**
 * Icon button with clear hover affordance + accessible tooltip label.
 */
export function IconAction({
  label,
  hint,
  variant = "default",
  side = "top",
  size = "md",
  className,
  children,
  disabled,
  type = "button",
  ...props
}: IconActionProps) {
  return (
    <TooltipProvider delayDuration={280}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type={type}
            disabled={disabled}
            aria-label={label}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center rounded-full transition-all duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
              size === "sm" ? "h-7 w-7" : "h-8 w-8",
              variantClass[variant],
              className
            )}
            {...props}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={8}
          className="z-[200] max-w-[220px] border border-border/40 bg-foreground px-2.5 py-1.5 text-background shadow-lg"
        >
          <p className="text-xs font-semibold leading-tight">{label}</p>
          {hint ? (
            <p className="mt-0.5 text-[10px] font-normal leading-snug text-background/75">
              {hint}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type HandleTooltipProps = {
  label: string;
  hint?: string;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
};

/** Tooltip wrapper for non-button handles (resize corners, etc.). */
export function HandleTooltip({
  label,
  hint,
  side = "top",
  children,
}: HandleTooltipProps) {
  return (
    <TooltipProvider delayDuration={320}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={10}
          className="z-[200] max-w-[220px] border border-border/40 bg-foreground px-2.5 py-1.5 text-background shadow-lg"
        >
          <p className="text-xs font-semibold leading-tight">{label}</p>
          {hint ? (
            <p className="mt-0.5 text-[10px] font-normal leading-snug text-background/75">
              {hint}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
