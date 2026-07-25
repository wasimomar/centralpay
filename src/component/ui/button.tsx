import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-40 active:scale-98 cursor-pointer select-none",
          // Variant styles
          variant === "default" && "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/10",
          variant === "destructive" && "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/10",
          variant === "outline" && "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-800",
          variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200/80",
          variant === "ghost" && "hover:bg-slate-50 hover:text-slate-800 text-slate-500",
          variant === "link" && "text-emerald-600 underline-offset-4 hover:underline",
          // Size styles
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-lg px-3",
          size === "lg" && "h-11 rounded-xl px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
