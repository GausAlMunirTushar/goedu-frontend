import { moduleWisePermissions, roleList } from "@/apis/endpoints/role_permissions_apis";
import type { ModulePermissionMap, RolePermissionType } from "@/apis/types/role_permission_type";
import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";

export const useRolesQuery = () => useQuery<TResponse<RolePermissionType[]>>(roleList);

export const useModulePermissionsQuery = () =>
    useQuery<TResponse<ModulePermissionMap>>(moduleWisePermissions);
