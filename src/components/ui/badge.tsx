import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-50 text-zinc-900",
        secondary: "border-transparent bg-zinc-800 text-zinc-50",
        destructive: "border-transparent bg-red-500 text-zinc-50",
        outline: "text-zinc-50 border-zinc-700",
        success: "border-transparent bg-emerald-600/20 text-emerald-400",
        warning: "border-transparent bg-yellow-600/20 text-yellow-400",
        info: "border-transparent bg-blue-600/20 text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
