export interface Tab {
    id: string;
    label: string;
    path: string;
    is_default?: boolean;
    required_permissions: string[];
}

export interface Submenu {
    id: string;
    label: string;
    path: string;
    icon?: string;
    required_permissions?: string[];
    permissions?: string[];
    tabs?: Tab[];
}

export interface Menu {
    id: string;
    label: string;
    icon?: string;
    path?: string;
    required_permissions?: string[];
    permissions?: string[];
    tabs?: Tab[];
    submenus?: Submenu[];
}

export interface ModuleConfig {
    id: string;
    label: string;
    icon: string;
    base_path: string;
    menus: Menu[];
}

export interface NavigationConfig {
    //permission_catalog: Record<string, string>;
    module: ModuleConfig;
}

export interface MenuItem {
    name: string;
    icon?: React.ReactNode;
    path: string;
    children?: MenuItem[];
}

// Helper function to check if user has required permissions
export function hasPermissions(requiredPermissions: string[], userPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

// Convert navigation config to sidebar menu items
export function convertConfigToMenuItems(
    config: NavigationConfig,
    userPermissions: string[],
): MenuItem[] {
    const menuItems: MenuItem[] = [];

    config.module.menus.forEach((menu) => {
        // Check if user has permission for this menu
        const menuPerms = menu.required_permissions || menu.permissions;
        if (
            menuPerms &&
            !hasPermissions(menuPerms, userPermissions)
        ) {
            return;
        }

        // If menu has submenus
        if (menu.submenus && menu.submenus.length > 0) {
            const children: MenuItem[] = [];

            menu.submenus.forEach((submenu) => {
                const subPerms = submenu.required_permissions || submenu.permissions;
                if (hasPermissions(subPerms || [], userPermissions)) {
                    children.push({
                        name: submenu.label,
                        path: submenu.path,
                        icon: undefined, // Will be set by icon mapper
                    });
                }
            });

            if (children.length > 0) {
                menuItems.push({
                    name: menu.label,
                    path: menu.path || "#",
                    icon: undefined, // Will be set by icon mapper
                    children,
                });
            }
        } else {
            // Simple menu item without submenus
            menuItems.push({
                name: menu.label,
                path: menu.path || "#",
                icon: undefined, // Will be set by icon mapper
            });
        }
    });

    return menuItems;
}

// Get tabs for a specific path
export function getTabsForPath(
    config: NavigationConfig,
    currentPath: string,
    userPermissions: string[],
): Tab[] {
    for (const menu of config.module.menus) {
        // Check direct menu tabs
        if (menu.tabs && menu.path === currentPath) {
            return menu.tabs.filter((tab) =>
                hasPermissions(tab.required_permissions, userPermissions),
            );
        }

        // Check submenu tabs
        if (menu.submenus) {
            for (const submenu of menu.submenus) {
                if (submenu.tabs && submenu.path === currentPath) {
                    return submenu.tabs.filter((tab) =>
                        hasPermissions(tab.required_permissions, userPermissions),
                    );
                }
            }
        }
    }

    return [];
}
