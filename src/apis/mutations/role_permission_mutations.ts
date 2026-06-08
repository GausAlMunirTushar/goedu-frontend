import { useForm } from "@/hooks/useForm";
import {
    createRole,
    updateRole,
    deleteRole,
    addPermissionToRole,
    removePermissionFromRole,
} from "@/apis/endpoints/role_permissions_apis";

/**
 * Role form type
 */
export type RoleFormType = {
    name: string;
    description: string;
    is_active: boolean;
    permission_ids: number[];
};

/**
 * Create Role
 */
export const useCreateRoleMutation = (data: RoleFormType) =>
    useForm<RoleFormType>(createRole, data, {
        method: "POST",
    });

/**
 * Update Role
 */
export const useUpdateRoleMutation = (roleId: number, data: RoleFormType) =>
    useForm<RoleFormType>(updateRole(roleId), data, {
        method: "PUT",
    });

/**
 * Delete Role
 */
export const useDeleteRoleMutation = (roleId: number) =>
    useForm<object>(
        deleteRole(roleId),
        {},
        {
            method: "DELETE",
        },
    );
