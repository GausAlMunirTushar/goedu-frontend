"use client";

import { ChevronDown, Plus } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    searchable?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    allowCreate?: boolean;
    createPlaceholder?: string;
}

const SelectInput: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error,
    helperText,
    fullWidth = true,
    required = false,
    disabled = false,
    className = "",
    containerClassName = "",
    labelClassName = "",
    searchable = false,
    searchValue,
    onSearchChange,
    allowCreate = false,
    createPlaceholder = "Type to add new...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
    const [customValue, setCustomValue] = useState("");
    const [isUsingCustom, setIsUsingCustom] = useState(false);
    const [hasUnsavedCustom, setHasUnsavedCustom] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const customInputRef = useRef<HTMLInputElement>(null);

    const hasError = !!error;

    useEffect(() => {
        if (value !== selectedValue) {
            setSelectedValue(value);

            if (value && !options.find((opt) => opt.value === value)) {
                setIsUsingCustom(true);
                setCustomValue(value);
            } else {
                setIsUsingCustom(false);
                setCustomValue("");
            }
            setHasUnsavedCustom(false);
        }
    }, [value, options, selectedValue]);

    const handleSaveCustomValue = useCallback(() => {
        if (customValue.trim()) {
            const trimmedValue = customValue.trim();
            setSelectedValue(trimmedValue);
            setIsUsingCustom(true);
            setHasUnsavedCustom(false);
            onChange?.(trimmedValue);
        } else {
            setIsUsingCustom(false);
            setHasUnsavedCustom(false);
            setCustomValue("");
            if (selectedValue && !options.find((opt) => opt.value === selectedValue)) {
                setSelectedValue("");
                onChange?.("");
            }
        }
    }, [customValue, selectedValue, options, onChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (hasUnsavedCustom && customValue.trim()) {
                    handleSaveCustomValue();
                }
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [hasUnsavedCustom, customValue, handleSaveCustomValue]);

    useEffect(() => {
        if (isOpen && allowCreate && isUsingCustom && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [isOpen, allowCreate, isUsingCustom]);

    const handleSelect = (selected: string) => {
        setSelectedValue(selected);
        setIsUsingCustom(false);
        setCustomValue("");
        setHasUnsavedCustom(false);
        onChange?.(selected);
        setIsOpen(false);
    };

    const handleCustomValueChange = (newValue: string) => {
        setCustomValue(newValue);
        setIsUsingCustom(true);
        setHasUnsavedCustom(true);
    };

    const handleCustomInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveCustomValue();
            setIsOpen(false);
        } else if (e.key === "Escape") {
            setCustomValue(
                selectedValue && !options.find((opt) => opt.value === selectedValue)
                    ? selectedValue
                    : "",
            );
            setHasUnsavedCustom(false);
            setIsOpen(false);
        }
    };

    const handleCustomInputBlur = () => {
        if (hasUnsavedCustom) {
            handleSaveCustomValue();
        }
    };

    const allOptions = [{ value: "", label: "-- None --" }, ...options];
    const selectedOption = allOptions.find((opt) => opt.value === selectedValue);

    const getDisplayText = () => {
        if (isUsingCustom && customValue) {
            return customValue;
        }
        return selectedOption ? selectedOption.label : placeholder;
    };

    return (
        <div className={`w-full ${containerClassName}`}>
            {/* Label */}
            {label && (
                <label
                    className={`block text-sm font-medium text-foreground mb-2 ${labelClassName}`}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            {/* Select Container */}
            <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
                {/* Select Button */}
                <button
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls="select-list"
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`
                        w-full px-4 py-1 rounded-md
                        bg-card border border-border text-foreground placeholder:text-muted-foreground
                        font-[inherit] text-base shadow-sm transition-all duration-200
                        flex justify-between items-center
                        focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-background
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${hasError ? "border-destructive/70 focus:ring-destructive/30" : "hover:border-ring"}
                        ${className}
                    `}
                >
                    <span
                        className={
                            !selectedValue && !isUsingCustom
                                ? "text-muted-foreground"
                                : "text-foreground"
                        }
                    >
                        {getDisplayText()}
                    </span>
                    <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-card border border-border rounded-lg shadow-lg animate-fade-in">
                        {/* Custom Input Field */}
                        {allowCreate && (
                            <div className="p-3 border-b border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                                    <input
                                        ref={customInputRef}
                                        type="text"
                                        value={customValue}
                                        onChange={(e) => handleCustomValueChange(e.target.value)}
                                        onKeyDown={handleCustomInputKeyDown}
                                        onBlur={handleCustomInputBlur}
                                        placeholder={createPlaceholder}
                                        className={`
                                            flex-1 px-3 py-1.5 rounded-lg text-sm
                                            bg-card border border-border text-foreground placeholder:text-muted-foreground
                                            focus:outline-none focus:ring-1 focus:ring-ring
                                            transition duration-200
                                        `}
                                    />
                                </div>
                                {hasUnsavedCustom && customValue && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Press Enter or click outside to save
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Search Field */}
                        {searchable && (
                            <div className="p-3 border-b border-border">
                                <input
                                    type="text"
                                    value={searchValue ?? ""}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    placeholder="Search options..."
                                    className={`
                                        w-full px-3 py-1.5 rounded-lg text-sm
                                        bg-card border border-border text-foreground placeholder:text-muted-foreground
                                        font-[inherit] focus:outline-none focus:ring-1 focus:ring-ring
                                        transition duration-200
                                    `}
                                />
                            </div>
                        )}

                        {/* Options List */}
                        <ul id="select-list" role="listbox" className="max-h-60 overflow-y-auto">
                            {allOptions.length > 0 ? (
                                allOptions.map((option) => {
                                    const isSelected =
                                        option.value === selectedValue &&
                                        !isUsingCustom &&
                                        !hasUnsavedCustom;
                                    return (
                                        <li
                                            key={option.value}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleSelect(option.value)}
                                            className={`
                                                px-4 py-2.5 text-sm cursor-pointer
                                                transition-colors duration-150
                                                ${
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground font-medium"
                                                        : "text-foreground hover:bg-secondary"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option.label}</span>
                                                {isSelected && (
                                                    <span className="text-primary-foreground ml-2">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="px-4 py-2.5 text-sm text-muted-foreground text-center">
                                    No options available
                                </li>
                            )}
                        </ul>
                    </div>
                )}

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
                    className={`text-xs mt-1.5 ${
                        hasError ? "text-destructive font-medium" : "text-muted-foreground"
                    } animate-fade-in`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export default SelectInput;
