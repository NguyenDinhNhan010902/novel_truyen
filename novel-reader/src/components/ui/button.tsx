import * as React from "react"
import { cn } from "@/lib/utils"

// Note: Removed unimplemented imports


// Note: We haven't installed class-variance-authority or radix-ui yet.
// I will simulate a simple button first without extra heavy deps if possible,
// OR I should install them. Given I want to keep it simple first without install storm:
// I'll write a simple Button component using just clsx/tailwind-merge for now.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-gray-900 text-white hover:bg-gray-900/90 shadow",
            outline: "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900",
            ghost: "hover:bg-gray-100 hover:text-gray-900",
            link: "text-gray-900 underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "h-9 px-4 py-2 text-sm",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
