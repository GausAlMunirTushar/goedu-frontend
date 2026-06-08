"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleSettingProps {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function ToggleSetting({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}: ToggleSettingProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
                <Label htmlFor={id} className="font-medium cursor-pointer">
                    {label}
                </Label>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
}
