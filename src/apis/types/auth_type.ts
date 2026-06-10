export interface Permission {
    id: string;
    name: string;
    description: string | null;
    module: string;
}

export interface Role {
    id: string;
    name: string;
    description: string | null;
    permissions?: Permission[];
}

export interface User {
    id: string;
    username: string;
    phone: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    roleId: string | null;
    role: Role | null;
}

export interface LoginResponseData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
}
