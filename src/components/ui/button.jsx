import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand-green text-white shadow hover:bg-brand-green/90",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-brand-green bg-transparent text-brand-green shadow-sm hover:bg-brand-green/10",
        secondary:
          "bg-brand-yellow text-black shadow-sm hover:bg-brand-yellow/90",
        ghost: "hover:bg-brand-green/10 hover:text-brand-green",
        link: "text-brand-green underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-brand-green to-brand-yellow text-white shadow hover:from-green-700 hover:to-yellow-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants } 