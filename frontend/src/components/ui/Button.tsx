import { cva, type VariantProps } from "class-variance-authority";
import type { ReactElement } from "react";
import type React from "react";

const buttonVariants = cva("transition-all rounded-md  focus:outline-none cursor-pointer",
    {
        variants: {
            variant: {
                primary: "bg-blue-200 text-blue-700 hover:bg-blue-300 focus:ring-blue-100",
                secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            },
            size: {
                small: "px-2 py-1 text-sm",
                medium: "px-4 py-1 text-base",
                large: "px-6 py-3 text-lg"
            },
            fullWidth: {
                true: "w-full",
                false: ""
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "medium",
            fullWidth: false
        },
    }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    text?: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant, size, fullWidth, text, isLoading = false, className, startIcon, ...props }) => {
    return (
        <button className={buttonVariants({ variant, size, fullWidth, className }) + " flex items-center       justify-center"} disabled={isLoading || props.disabled} {...props} >
            {isLoading ?
                (
                    <div className="flex items-center gap-2">
                        <Spinner />
                    </div>
                )
                : (
                    <> {startIcon && <span className="mr-2">{startIcon}</span>}
                        <span>{text}</span>
                    </>
                )
            }
        </button>
    )
}

function Spinner() {
    return (
        <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    )
};