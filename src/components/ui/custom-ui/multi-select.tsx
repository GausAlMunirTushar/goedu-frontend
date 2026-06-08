"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

type Option = { label: string; value: string | number; disabled?: boolean };

type Props = {
    options: Option[];
    value: Array<string | number>;
    onChange: (val: Array<string | number>) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    maxVisible?: number; // how many labels to show before +N
    showChips?: boolean; // if true, shows removable chips (still single-line)
    disabled?: boolean; // disable whole control (e.g. when budget approved)
};

export function MultiSelect({
    options = [],
    value = [],
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    className,
    maxVisible = 1,
    showChips = false,
    disabled = false,
}: Props) {
    const [open, setOpen] = React.useState(false);

    const selectedOptions = React.useMemo(
        () => options.filter((o) => value.includes(o.value)),
        [options, value],
    );

    const toggle = (val: string | number) => {
        if (disabled) return;
        if (value.includes(val)) onChange(value.filter((v) => v !== val));
        else onChange([...value, val]);
    };

    const clear = () => {
        if (disabled) return;
        onChange([]);
    };

    const removeOne = (val: string | number) => {
        if (disabled) return;
        onChange(value.filter((v) => v !== val));
    };

    const visible = selectedOptions.slice(0, maxVisible);
    const extraCount = Math.max(0, selectedOptions.length - visible.length);

    return (
        <Popover open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-disabled={disabled}
                    disabled={disabled}
                    className={cn("w-full justify-between gap-2", className)}
                >
                    {/* LEFT: value display (single-line) */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        {selectedOptions.length === 0 ? (
                            <span className="truncate text-muted-foreground">{placeholder}</span>
                        ) : showChips ? (
                            // chips mode (still single-line; scroll horizontally if many)
                            <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden">
                                <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto scrollbar-none">
                                    {selectedOptions.map((s) => (
                                        <Badge
                                            key={String(s.value)}
                                            variant="secondary"
                                            className="flex items-center gap-1 whitespace-nowrap"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span className="max-w-[160px] truncate">
                                                {s.label}
                                            </span>
                                            {!disabled && (
                                                <button
                                                    type="button"
                                                    className="rounded-sm p-0.5 hover:bg-muted"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeOne(s.value);
                                                    }}
                                                    aria-label={`Remove ${s.label}`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // compact mode: "FY 2025-2026" + "+1"
                            <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
                                {visible.map((s) => (
                                    <span key={String(s.value)} className="min-w-0 truncate">
                                        {s.label}
                                    </span>
                                ))}
                                {extraCount > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="shrink-0 whitespace-nowrap"
                                    >
                                        +{extraCount}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: actions */}
                    <div className="flex shrink-0 items-center gap-2">
                        {selectedOptions.length > 0 && !disabled && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    clear();
                                }}
                                className="rounded p-1 hover:bg-accent"
                                aria-label="Clear selection"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>No results.</CommandEmpty>

                        <CommandGroup>
                            {options.map((opt) => {
                                const isSelected = value.includes(opt.value);
                                return (
                                    <CommandItem
                                        key={String(opt.value)}
                                        value={opt.label}
                                        disabled={opt.disabled || disabled}
                                        // IMPORTANT: prevent Popover from closing / losing focus weirdly
                                        onMouseDown={(e) => e.preventDefault()}
                                        onSelect={() => toggle(opt.value)}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "opacity-50",
                                            )}
                                        >
                                            {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                                        </span>
                                        <span className="truncate">{opt.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
