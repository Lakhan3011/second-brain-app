import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: React.HTMLInputTypeAttribute;
    placeholder: string;
    ref?: any
}

export function Input({ value, onChange, placeholder, type, ref, ...props }: InputProps) {
    return (
        <input
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className="w-full  px-4 py-2 border-2 border-slate-500 rounded mb-2 outline-none "
            ref={ref}
            {...props}
        />

    )
}