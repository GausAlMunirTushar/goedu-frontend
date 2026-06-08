"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
    (
        {
            options,
            selected,
            onChange,
            placeholder = "Select...",
            emptyMessage = "No items found.",
            className,
            disabled,
        },
        ref,
    ) => {
        const [open, setOpen] = React.useState(false);

        const handleUnselect = (value: string) => {
            onChange(selected.filter((item) => item !== value));
        };

        const handleSelect = (value: string) => {
            if (selected.includes(value)) {
                onChange(selected.filter((item) => item !== value));
            } else {
                onChange([...selected, value]);
            }
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        ref={ref}
                        className={cn(
                            "flex h-10 w-full min-w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-[inherit] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            className,
                        )}
                        disabled={disabled}
                        onClick={() => setOpen(!open)}
                        type="button"
                    >
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {selected.length === 0 && (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                            {selected.map((value) => {
                                const option = options.find((o) => o.value === value);
                                return (
                                    <Badge
                                        key={value}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-2 py-0.5"
                                    >
                                        {option?.label || value}
                                        <button
                                            className="hover:bg-muted rounded-full p-0.5"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnselect(value);
                                            }}
                                            type="button"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                );
                            })}
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selected.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={handleSelect}
                                            className="cursor-pointer"
                                        >
                                            <span>{option.label}</span>
                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        isSelected ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

MultiSelect.displayName = "MultiSelect";
