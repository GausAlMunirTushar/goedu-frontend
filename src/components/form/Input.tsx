"use client";
import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    isPassword?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            placeholder,
            error,
            helperText,
            icon,
            iconPosition = "left",
            isPassword = false,
            disabled = false,
            required = false,
            className = "",
            containerClassName = "",
            labelClassName = "",
            type = "text",
            ...rest
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = isPassword && showPassword ? "text" : isPassword ? "password" : type;
        const hasError = !!error;

        return (
            <div className={`w-full ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={rest.id}
                        className={`block text-sm font-medium mb-2 select-none text-foreground ${labelClassName}`}
                    >
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                {/* Input Container */}
                <div className="relative group animate-fade-in">
                    {/* Left Icon */}
                    {icon && iconPosition === "left" && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground pointer-events-none">
                            {icon}
                        </span>
                    )}
                    {/* Input Field */}
                    <input
                        ref={ref}
                        type={inputType}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`
              w-full px-4 py-2 rounded-md
              bg-card border border-border text-foreground placeholder:text-muted-foreground/50
              font-[inherit] text-base transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-background
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" && !isPassword ? "pr-10" : ""}
              ${isPassword ? "pr-10" : ""}
              ${hasError ? "border-destructive/70 focus:ring-destructive/30" : "hover:border-ring"}
              ${className}
            `}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError
                                ? `${rest.id}-error`
                                : helperText
                                  ? `${rest.id}-helper`
                                  : undefined
                        }
                        {...rest}
                    />
                    {/* Password Toggle or Right Icon */}
                    {isPassword ? (
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={disabled}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    ) : icon && iconPosition === "right" ? (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground pointer-events-none">
                            {icon}
                        </span>
                    ) : null}
                    {/* Error Icon */}
                    {/* {hasError && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            <AlertCircle className="h-5 w-5 text-destructive animate-bounce-in" />
                        </span>
                    )} */}
                </div>
                {/* Helper Text or Error Message */}
                {(error || helperText) && (
                    <p
                        id={hasError ? `${rest.id}-error` : `${rest.id}-helper`}
                        className={`text-xs mt-1.5 ${
                            hasError ? "text-destructive font-medium" : "text-muted-foreground"
                        } animate-fade-in`}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";

export default Input;
