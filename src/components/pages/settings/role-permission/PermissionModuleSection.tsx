"use client";

import type { PermissionType } from "@/apis/types/role_permission_type";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface PermissionModuleSectionProps {
    moduleName: string;
    permissions: PermissionType[];
    selectedIds: Set<string>;
    disabled?: boolean;
    labels: {
        general: string;
        permissions: string;
        selectAll: string;
    };
    onToggle: (permissionId: string, checked: boolean) => void;
    onToggleMany: (permissionIds: string[], checked: boolean) => void;
}

function getCategory(permissionName: string) {
    const parts = permissionName.split(".");
    return parts.length > 2 ? parts.slice(1, -1).join(".") : "general";
}

function formatLabel(value: string) {
    return value.replace(/[._-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

export function PermissionModuleSection({
    moduleName,
    permissions,
    selectedIds,
    disabled,
    labels,
    onToggle,
    onToggleMany,
}: PermissionModuleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const groupedPermissions = useMemo(
        () =>
            permissions.reduce<Record<string, PermissionType[]>>((groups, permission) => {
                const category = getCategory(permission.name);
                groups[category] = [...(groups[category] || []), permission];
                return groups;
            }, {}),
        [permissions],
    );

    const selectedCount = permissions.filter((permission) => selectedIds.has(permission.id)).length;
    const allSelected = permissions.length > 0 && selectedCount === permissions.length;
    const partiallySelected = selectedCount > 0 && !allSelected;

    return (
        <section className="overflow-hidden rounded-lg border bg-card">
            <div className="flex min-h-14 items-center gap-3 border-b px-4 py-3">
                <button
                    type="button"
                    onClick={() => setIsExpanded((value) => !value)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? (
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate text-sm font-semibold">
                        {formatLabel(moduleName)}
                    </span>
                    <Badge variant="outline">
                        {selectedCount}/{permissions.length}
                    </Badge>
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <Checkbox
                        checked={partiallySelected ? "indeterminate" : allSelected}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                            onToggleMany(
                                permissions.map((permission) => permission.id),
                                checked === true,
                            )
                        }
                    />
                    {labels.selectAll}
                </label>
            </div>

            {isExpanded && (
                <div className="divide-y">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category} className="grid gap-3 p-4 md:grid-cols-[150px_1fr]">
                            <div>
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
                                    <Checkbox
                                        checked={
                                            categoryPermissions.every((permission) =>
                                                selectedIds.has(permission.id),
                                            )
                                                ? true
                                                : categoryPermissions.some((permission) =>
                                                        selectedIds.has(permission.id),
                                                    )
                                                  ? "indeterminate"
                                                  : false
                                        }
                                        disabled={disabled}
                                        onCheckedChange={(checked) =>
                                            onToggleMany(
                                                categoryPermissions.map(
                                                    (permission) => permission.id,
                                                ),
                                                checked === true,
                                            )
                                        }
                                    />
                                    {category === "general"
                                        ? labels.general
                                        : formatLabel(category)}
                                </label>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {categoryPermissions.length} {labels.permissions}
                                </p>
                            </div>
                            <div className="grid gap-2 lg:grid-cols-2">
                                {categoryPermissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex min-h-16 cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40"
                                    >
                                        <Checkbox
                                            className="mt-0.5"
                                            checked={selectedIds.has(permission.id)}
                                            disabled={disabled}
                                            onCheckedChange={(checked) =>
                                                onToggle(permission.id, checked === true)
                                            }
                                        />
                                        <span className="min-w-0">
                                            <span className="block break-words text-sm font-medium">
                                                {formatLabel(permission.name)}
                                            </span>
                                            {permission.description && (
                                                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                    {permission.description}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
