//Permission Related APIs
export const permissions = "/rbac/permissions/";
export const modueleWisePermissions = "/rbac/permissions/by_module/";

//Role Relaed APIs
export const createRole = "/rbac/roles/";
export const roleList = "/rbac/roles/";
export const addPermissionToRole = (roleId: number) => /rbac/roles/${roleId}/add_permissions/;
export const removePermissionFromRole = (roleId: number) =>
    /rbac/roles/${roleId}/remove_permissions/;
export const getRoleDetails = (roleId: number) => /rbac/roles/${roleId}/;
export const updateRole = (roleId: number) => /rbac/roles/${roleId}/;
export const deleteRole = (roleId: number) => /rbac/roles/${roleId}/;
