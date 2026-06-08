import { useAuth } from "./useApplication";

export const usePermissions = () => {
    const { user } = useAuth();

    const hasPermission = (requiredPermission: string): boolean => {
        if (!user?.permissions) return false;

        if (user.roles.includes("superuser")) return true;

        const [requiredModule, requiredAction] = requiredPermission.split(".");

        return user.permissions.some((perm: string) => {
            const [permModule, permAction] = perm.split(".");
            return permModule === requiredModule && permAction === requiredAction;
        });
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some((permission) => hasPermission(permission));
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every((permission) => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        permissions: user?.permissions || [],
    };
};
