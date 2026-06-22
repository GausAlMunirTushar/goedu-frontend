export interface RolePermissionType {
    id: string;
    name: string;
    description?: string | null;
    permissions: PermissionType[];
}

export interface PermissionType {
    id: string;
    name: string;
    description?: string | null;
    module: string;
}

export type ModulePermissionMap = Record<string, PermissionType[]>;
