export interface RolePermissionType {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    is_system_role: boolean;
    permission_count: number;
    user_count: number;
    created_at: string;
}

export interface PermissionType {
    id: number;
    codename: string;
    name: string;
    module: string;
    is_active: boolean;
}

export interface AssignedUserType {
    id: number;
    email: string;
    full_name: string;
    assigned_at: string;
}

export interface RolePermissionDetailType {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    is_system_role: boolean;
    permissions: PermissionType[];
    assigned_users: AssignedUserType[];
    created_at: string;
    updated_at: string;
}

export interface ModulePermission {
    id: number;
    codename: string;
    name: string;
    description: string;
}

export type ModulePermissionMap = {
    [module: string]: ModulePermission[];
};
