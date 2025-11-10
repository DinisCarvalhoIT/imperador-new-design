import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3 py-2",
        xs: "h-6 rounded-sm px-2 font-normal text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'colors',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: 'hsl(221.2, 83.2%, 53.3%)',
        color: 'hsl(210, 40%, 98%)',
      },
      secondary: {
        backgroundColor: 'hsl(210, 40%, 96.1%)',
        color: 'hsl(222.2, 47.4%, 11.2%)',
      },
    };
    
    const sizeStyles: Record<string, React.CSSProperties> = {
      icon: {
        height: '2.25rem',
        width: '2.25rem',
        padding: 0,
      },
    };
    
    const combinedStyle = {
      ...baseStyles,
      ...(variant ? variantStyles[variant] : variantStyles.default),
      ...(size ? sizeStyles[size] : {}),
    };
    
    return (
      <Comp
        style={combinedStyle}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

