import {
    roleList,
    getRoleDetails,
    modueleWisePermissions,
} from "@/apis/endpoints/role_permissions_apis";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useQuery } from "@/hooks/useQuery";
import {
    RolePermissionDetailType,
    RolePermissionType,
    ModulePermissionMap,
} from "@/apis/types/role_permission_type";
import type { TResponse } from "@/types/configs";

export const useRolesQuery = (
    initialPage = 1,
    initialPerPage = 30,
    initialClassId: number | null = null,
    initialQ = "",
) =>
    usePaginatedQuery<RolePermissionType>(roleList, {
        initialPage,
        initialPerPage,
        initialClassId,
        initialQ,
    });

export const useRoleDetailQuery = (id: number | null | undefined) =>
    useQuery<TResponse<RolePermissionDetailType>>(id ? getRoleDetails(id) : null);

export const useModuleWisePermissionsQuery = () =>
    useQuery<TResponse<ModulePermissionMap>>(modueleWisePermissions);
