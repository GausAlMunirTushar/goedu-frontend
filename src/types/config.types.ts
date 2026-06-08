// Type definitions for the app configuration system

export interface AppInfo {
    name: string;
    short_name: string;
    version: string;
    default_language: string;
    supported_languages: string[];
}

export interface LayoutConfig {
    module_bar: {
        width: string;
        position: "fixed" | "relative";
        logo: {
            text: string;
            gradient: string;
        };
    };
    module_sidebar: {
        width: string;
        position: "fixed" | "relative";
        collapsible: boolean;
    };
    topbar: {
        height: string;
        position: "fixed" | "relative";
        show_breadcrumbs: boolean;
        show_search: boolean;
        show_notifications: boolean;
        show_user_menu: boolean;
    };
}

export interface Module {
    id: string;
    name: string;
    label: string;
    icon: string;
    color: string;
    path: string;
    order: number;
    enabled: boolean;
    required_permissions: string[];
    config_file: string;
    has_sidebar?: boolean;
    contain_menus?: string[];
}

export interface Permission {
    [key: string]: string;
}

export interface UserRole {
    label: string;
    permissions: string[];
}

export interface Theme {
    primary_color: string;
    sidebar_bg: string;
    topbar_bg: string;
    content_bg: string;
    dark_mode: boolean;
}

export interface Features {
    multi_language: boolean;
    notifications: boolean;
    search: boolean;
    breadcrumbs: boolean;
    user_profile: boolean;
    help_system: boolean;
    activity_logs: boolean;
}

export interface AppConfig {
    app: AppInfo;
    layout: LayoutConfig;
    modules: Module[];
    global_permissions: Permission;
    user_roles: { [key: string]: UserRole };
    theme: Theme;
    features: Features;
}

// Navigation types (for module-specific configs)
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
    required_permissions: string[];
    tabs?: Tab[];
}

export interface Menu {
    id: string;
    label: string;
    icon: string;
    path?: string;
    required_permissions?: string[];
    tabs?: Tab[];
    submenus?: Submenu[];
}

export interface ModuleConfig {
    permission_catalog: Permission;
    module: {
        id: string;
        label: string;
        icon: string;
        base_path: string;
        menus: Menu[];
    };
}

export interface NavigationConfig {
    permission_catalog: Permission;
    module: {
        id: string;
        label: string;
        icon: string;
        base_path: string;
        menus: Menu[];
    };
}
