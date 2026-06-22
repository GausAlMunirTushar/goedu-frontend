//Permission Related APIs
export const permissions = "/rbac/permissions";
export const moduleWisePermissions = "/rbac/permissions/by_module";

//Role Relaed APIs
export const createRole = "/rbac/roles";
export const roleList = "/rbac/roles";
export const addPermissionToRole = (roleId: string) => `/rbac/roles/${roleId}/add_permissions`;
export const removePermissionFromRole = (roleId: string) =>
    `/rbac/roles/${roleId}/remove_permissions`;
export const getRoleDetails = (roleId: string) => `/rbac/roles/${roleId}`;
export const updateRole = (roleId: string) => `/rbac/roles/${roleId}`;
export const deleteRole = (roleId: string) => `/rbac/roles/${roleId}`;
