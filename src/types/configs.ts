import type { AxiosRequestConfig } from "axios";
import type { SWRConfiguration } from "swr";

export interface ApiRequestConfig extends AxiosRequestConfig {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: object | FormData;
}

export interface SWRConfig extends SWRConfiguration {
    shouldRetryOnError?: boolean;
}

export type TResponse<T> = {
    message: string;
    success: boolean;
    data: T;
};

export type TPaginationMeta = {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    current_page: number;
    total_pages: number;
};

export type TPaginatedResponse<T> = {
    message: string;
    success: boolean;
    data: T[];
    pagination: TPaginationMeta;
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    employee_id: string | null;
    designation: string;
    department: string;
    phone: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_active: boolean;
    roles: string[];
    permissions: string[];
};

export type UniversityType = {
    id: number;
    university_name_en: string;
    university_name_bn: string;
    university_name: string;
    university_short_name: string;
    logo: string | null;
    logo_url: string | null;
    address_en: string;
    address_bn: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    established_year: number;
};

export type RoleType = {
    id: number;
    name: string;
    organization_id: number;
    created_at: string;
    updated_at: string;
    created_by: number | null;
    updated_by: number | null;
};

export type FiscalYearType = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_closed: boolean;
    is_current: boolean;
};

export type CurrencyType = {
    id: number;
    code: string;
    name: string;
    symbol: string;
    decimal_places: number;
    is_default?: boolean;
    exchange_rate: number | null;
};

export type TaxTypeType = {
    id: number;
    name: string;
    description: string;
    is_compound: 0 | 1;
};

export type SystemConfigType = {
    budget_approval_required: string;
    currency: string;
    date_format: string;
    disbursement_approval_required: string;
    fiscal_year_start_month: string;
    max_login_attempts: string;
    session_timeout: string;
    timezone: string;
};
