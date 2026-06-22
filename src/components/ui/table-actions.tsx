"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, MoreHorizontalIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";

interface TableActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isLoading?: boolean;
    extraActionsFirst?: boolean;
    extraActions?: {
        label: string;
        onClick: () => void;
        destructive?: boolean;
        text?: string;
        icon?: React.ReactNode;
        disabled?: boolean;
        colorClass?: string;
    }[];
}

/* ---------------- Action Icon  ---------------- */
const ActionIcon = ({
    onClick,
    label,
    children,
    colorClass,
    disabled,
    text,
}: {
    onClick?: () => void;
    label: string;
    children: React.ReactNode;
    colorClass: string;
    disabled?: boolean;
    text?: string;
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={`p-1.5 rounded transition cursor-pointer font-[inherit] flex items-center gap-1.5 ${colorClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {children}
                    {text && <span className="text-xs font-semibold pr-1">{text}</span>}
                </button>
            </TooltipTrigger>
            <TooltipContent side="top">
                <p className="text-xs font-[inherit]">{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

/* ---------------- Main Component ---------------- */
const TableActions: React.FC<TableActionsProps> = ({
    onView,
    onEdit,
    onDelete,
    extraActions = [],
    extraActionsFirst = false,
}) => {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);

    // Build standard actions array
    const standardActions = [
        onView && {
            key: "view",
            label: t("view"),
            onClick: onView,
            icon: <Eye size={16} />,
            colorClass: "border border-cyan-300 text-cyan-600 hover:bg-cyan-200",
        },
        onEdit && {
            key: "edit",
            label: t("edit"),
            onClick: onEdit,
            icon: <Pencil size={16} />,
            colorClass: "border border-primary/30 text-primary hover:bg-primary/10",
        },
        onDelete && {
            key: "delete",
            label: t("delete"),
            onClick: onDelete,
            destructive: true,
            icon: <Trash2 size={16} />,
            colorClass: "border border-red-300 text-red-600 hover:bg-red-200",
        },
    ].filter(Boolean) as {
        key: string;
        label: string;
        onClick: () => void;
        destructive?: boolean;
        icon: React.ReactNode;
        colorClass: string;
        text?: string;
        disabled?: boolean;
    }[];

    // Build extra actions array with default styling
    const styledExtraActions = extraActions.map((action, index) => ({
        key: `extra-${index}`,
        label: action.label,
        onClick: action.onClick,
        destructive: action.destructive,
        icon: action.icon || <PlusCircle size={16} />,
        colorClass:
            action.colorClass ||
            (action.destructive
                ? "border border-red-300 text-red-600 hover:bg-red-200"
                : "border border-green-300 text-green-600 hover:bg-green-200"),
        disabled: action.disabled,
        text: action.text,
    }));

    // Build total actions array based on extraActionsFirst prop
    const totalActions = extraActionsFirst
        ? [...styledExtraActions, ...standardActions]
        : [...standardActions, ...styledExtraActions];

    /* ---------------- Case 1: Inline icons (≤ 4 actions total) ---------------- */
    if (totalActions.length <= 4) {
        return (
            <div className="flex items-center gap-1">
                {totalActions.map((action) => (
                    <ActionIcon
                        key={action.key}
                        onClick={action.onClick}
                        label={action.label}
                        colorClass={action.colorClass}
                        disabled={action.disabled}
                        text={action.text}
                    >
                        {action.icon}
                    </ActionIcon>
                ))}
            </div>
        );
    }

    /* ---------------- Case 2: Dropdown (> 4 actions) ---------------- */
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label={t("open_actions")}>
                    <MoreHorizontalIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 font-semibold">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>

                {totalActions.map((action) => (
                    <DropdownMenuItem
                        key={action.key}
                        onSelect={action.onClick}
                        className={action.destructive ? "text-red-600 focus:text-red-600" : ""}
                    >
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TableActions;
