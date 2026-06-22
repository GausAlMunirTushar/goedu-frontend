"use client";

import { AxiosAPI } from "@/apis/configs";
import {
    addPermissionToRole,
    removePermissionFromRole,
} from "@/apis/endpoints/role_permissions_apis";
import { useModulePermissionsQuery, useRolesQuery } from "@/apis/queries/rbac_queries";
import type { PermissionType } from "@/apis/types/role_permission_type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/custom-ui/title";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { RotateCcw, Save, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PermissionModuleSection } from "./PermissionModuleSection";

function setsAreEqual(first: Set<string>, second: Set<string>) {
    return first.size === second.size && [...first].every((value) => second.has(value));
}

export function RolePermissionManager() {
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const {
        data: rolesResponse,
        error: rolesError,
        isLoading: rolesLoading,
        mutate: mutateRoles,
    } = useRolesQuery();
    const {
        data: permissionsResponse,
        error: permissionsError,
        isLoading: permissionsLoading,
    } = useModulePermissionsQuery();

    const roles = useMemo(() => rolesResponse?.data || [], [rolesResponse]);
    const permissionModules = useMemo(() => permissionsResponse?.data || {}, [permissionsResponse]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [originalIds, setOriginalIds] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const selectedRole = useMemo(
        () => roles.find((role) => role.id === selectedRoleId),
        [roles, selectedRoleId],
    );

    useEffect(() => {
        if (!selectedRoleId && roles.length > 0) {
            setSelectedRoleId(roles[0].id);
        }
    }, [roles, selectedRoleId]);

    useEffect(() => {
        const assignedIds = new Set(
            selectedRole?.permissions?.map((permission) => permission.id) || [],
        );
        setSelectedIds(assignedIds);
        setOriginalIds(new Set(assignedIds));
    }, [selectedRole]);

    const filteredModules = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return permissionModules;

        return Object.entries(permissionModules).reduce<Record<string, PermissionType[]>>(
            (modules, [moduleName, permissions]) => {
                const matching = permissions.filter((permission) =>
                    [moduleName, permission.name, permission.description || ""].some((value) =>
                        value.toLowerCase().includes(query),
                    ),
                );
                if (matching.length > 0) modules[moduleName] = matching;
                return modules;
            },
            {},
        );
    }, [permissionModules, search]);

    const allPermissions = useMemo(
        () => Object.values(permissionModules).flat(),
        [permissionModules],
    );
    const hasChanges = !setsAreEqual(selectedIds, originalIds);

    const togglePermission = (permissionId: string, checked: boolean) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            checked ? next.add(permissionId) : next.delete(permissionId);
            return next;
        });
    };

    const toggleMany = (permissionIds: string[], checked: boolean) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            permissionIds.forEach((permissionId) =>
                checked ? next.add(permissionId) : next.delete(permissionId),
            );
            return next;
        });
    };

    const resetChanges = () => setSelectedIds(new Set(originalIds));

    const savePermissions = async () => {
        if (!selectedRoleId || !hasChanges) return;

        const addedIds = [...selectedIds].filter((id) => !originalIds.has(id));
        const removedIds = [...originalIds].filter((id) => !selectedIds.has(id));
        setIsSaving(true);

        try {
            await Promise.all([
                addedIds.length
                    ? AxiosAPI.post(addPermissionToRole(selectedRoleId), {
                          permissionIds: addedIds,
                      })
                    : Promise.resolve(),
                removedIds.length
                    ? AxiosAPI.post(removePermissionFromRole(selectedRoleId), {
                          permissionIds: removedIds,
                      })
                    : Promise.resolve(),
            ]);
            setOriginalIds(new Set(selectedIds));
            await mutateRoles();
            toast.success(t("role_permissions_saved"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("role_permissions_save_failed"));
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = rolesLoading || permissionsLoading;
    const hasError = rolesError || permissionsError;

    return (
        <div className="space-y-5 p-4 md:p-6">
            <header className="flex flex-col justify-between gap-4 border-b pb-5 lg:flex-row lg:items-end">
                <div>
                    <Title>{t("role_permissions")}</Title>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t("role_permissions_description")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!hasChanges || isSaving}
                        onClick={resetChanges}
                    >
                        <RotateCcw className="size-4" />
                        {t("reset")}
                    </Button>
                    <Button
                        type="button"
                        disabled={!selectedRoleId || !hasChanges || isSaving}
                        onClick={savePermissions}
                    >
                        <Save className="size-4" />
                        {isSaving ? t("saving") : t("save_permissions")}
                    </Button>
                </div>
            </header>

            <section className="grid gap-4 border-b pb-5 lg:grid-cols-[minmax(240px,360px)_1fr_auto] lg:items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t("select_role")}</label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("select_role_placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="permission-search" className="text-sm font-medium">
                        {t("search_permissions")}
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="permission-search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t("search_permissions_placeholder")}
                            className="pl-9"
                        />
                    </div>
                </div>
                <div className="flex min-h-10 items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="size-4" />
                    <span>
                        {selectedIds.size} {t("of")} {allPermissions.length} {t("assigned")}
                    </span>
                </div>
            </section>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-28 w-full" />
                    ))}
                </div>
            ) : hasError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                    {t("permissions_load_failed")}
                </div>
            ) : !selectedRoleId ? (
                <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                    {t("select_role_to_manage")}
                </div>
            ) : Object.keys(filteredModules).length === 0 ? (
                <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                    {t("no_permissions_found")}
                </div>
            ) : (
                <div className="space-y-3">
                    {Object.entries(filteredModules)
                        .sort(([first], [second]) => first.localeCompare(second))
                        .map(([moduleName, modulePermissions]) => (
                            <PermissionModuleSection
                                key={moduleName}
                                moduleName={moduleName}
                                permissions={modulePermissions}
                                selectedIds={selectedIds}
                                disabled={isSaving}
                                labels={{
                                    general: t("general"),
                                    permissions: t("permissions"),
                                    selectAll: t("select_all"),
                                }}
                                onToggle={togglePermission}
                                onToggleMany={toggleMany}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
