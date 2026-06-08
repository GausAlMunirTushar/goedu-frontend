export interface Setting {
    id: number;
    key: string;
    value: string;
    label: string;
    description: string;
    type: "text" | "number" | "boolean" | "select" | "date" | "time" | "textarea";
    category: "general" | "attendance" | "payroll" | "leave" | "security" | "notifications";
    options?: string[]; // For select type
    is_required: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SettingDetail {
    id: number;
    key: string;
    value: string;
    label: string;
    description: string;
    type: "text" | "number" | "boolean" | "select" | "date" | "time" | "textarea";
    category: "general" | "attendance" | "payroll" | "leave" | "security" | "notifications";
    options?: string[];
    is_required: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UpdateSettingRequest {
    value: string;
}

export interface SettingsGroup {
    id: string;
    name: string;
    description: string;
    settings: Setting[];
}
