import type { AppConfig, Module, ModuleConfig } from "@/types/config.types";
import appConfigJson from "@/configs/nav-config/app-config.json";

/**
 * Load the main app configuration
 */
export function getAppConfig(): AppConfig {
    return appConfigJson as unknown as AppConfig;
}

/**
 * Get all enabled modules
 */
export function getEnabledModules(): Module[] {
    const config = getAppConfig();
    return config.modules.filter((mod) => mod.enabled).sort((a, b) => a.order - b.order);
}

/**
 * Get modules accessible by user based on permissions
 * @param userPermissions - Array of permission strings assigned to the user's role (from API/backend)
 */
export function getAccessibleModules(userPermissions: string[]): Module[] {
    const modules = getEnabledModules();

    return modules.filter((mod) => {
        // Super admin has access to everything
        if (userPermissions.includes("SUPER_ADMIN")) {
            return true;
        }

        // Check if user has any of the required permissions
        return hasPermissions(userPermissions, mod.required_permissions);
    });
}

/**
 * Get a specific module by ID
 */
export function getModuleById(moduleId: string): Module | undefined {
    const config = getAppConfig();
    return config.modules.find((mod) => mod.id === moduleId);
}

/**
 * Load module-specific configuration
 */
export async function getModuleConfig(moduleId: string): Promise<ModuleConfig | null> {
    try {
        const mod = getModuleById(moduleId);
        if (!mod || !mod.config_file) {
            return null;
        }

        // Dynamic import for module config
        const moduleConfig = await import(`@/configs/nav-config/modules/${mod.config_file}`);
        return moduleConfig.default || moduleConfig;
    } catch (error) {
        console.error(`Failed to load config for module: ${moduleId}`, error);
        return null;
    }
}

/**
 * Check if user has required permissions
 * @param userPermissions - Array of permission strings assigned to the user's role
 * @param requiredPermissions - Array of required permissions to check
 */
export function hasPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }

    // Super admin has all permissions
    if (userPermissions.includes("SUPER_ADMIN")) {
        return true;
    }

    // Check if user has at least one of the required permissions
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof AppConfig["features"]): boolean {
    const config = getAppConfig();
    return config.features[featureName] ?? false;
}

/**
 * Get theme configuration
 */
export function getThemeConfig() {
    const config = getAppConfig();
    return config.theme;
}

/**
 * Get layout configuration
 */
export function getLayoutConfig() {
    const config = getAppConfig();
    return config.layout;
}

/**
 * Get breadcrumb trail for a given path
 */
export async function getBreadcrumbs(
    pathname: string,
    moduleConfig?: ModuleConfig,
): Promise<Array<{ label: string; path: string }>> {
    const breadcrumbs: Array<{ label: string; path: string }> = [];

    // Add home
    breadcrumbs.push({ label: "Home", path: "/" });

    // Parse path segments
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return breadcrumbs;
    }

    // Add module
    const moduleId = segments[0];
    const mod = getModuleById(moduleId);

    if (mod) {
        breadcrumbs.push({ label: mod.label, path: mod.path });
    }

    // Add submenu items from module config if available
    if (moduleConfig && segments.length > 1) {
        const currentPath = `/${segments.join("/")}`;

        // Search through menus to find matching path
        for (const menu of moduleConfig.module.menus) {
            if (menu.path === currentPath) {
                breadcrumbs.push({ label: menu.label, path: menu.path });
                break;
            }

            if (menu.submenus) {
                for (const submenu of menu.submenus) {
                    if (submenu.path === currentPath) {
                        breadcrumbs.push({ label: menu.label, path: menu.path || "#" });
                        breadcrumbs.push({ label: submenu.label, path: submenu.path });
                        break;
                    }
                }
            }
        }
    }

    return breadcrumbs;
}

/**
 * Get active module from pathname
 * Checks contain_menus array to match route segments with module menus
 */
export function getActiveModule(pathname: string): Module | undefined {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
        return undefined;
    }

    // Get all enabled modules
    const modules = getEnabledModules();

    // Check each segment against contain_menus in modules
    for (const segment of segments) {
        const moduleMatch = modules.find(
            (mod) => mod.contain_menus && mod.contain_menus.includes(segment),
        );
        if (moduleMatch) {
            return moduleMatch;
        }
    }

    // Fallback to checking first segment as module ID
    const moduleId = segments[0];
    return getModuleById(moduleId);
}
