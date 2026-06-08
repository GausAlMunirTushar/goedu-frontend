// App Configuration
export const APP_CONFIG = {
    SITE_NAME: "University Management System",
    SUPPORT_EMAIL: "support@myapp.com",
    VERSION: "1.0.0",
} as const;

// Cookies Keys
export const COOKIES_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
    AUTH_TOKEN: "token",
    USER_PROFILE: "user_profile",
    LOCALE: "locale",
    EXPIRY_TIME: "expiry_time",
    FISCAL_YEAR: "fiscal_year",
} as const;

// Common UI Constants
export const UI_CONSTANTS = {
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_DEBOUNCE_DELAY: 300,
    MAX_FILE_SIZE: 800 * 1024, // 800KB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
    DATE_FORMAT: "yyyy-MM-dd",
    DATETIME_FORMAT: "yyyy-MM-dd HH:mm:ss",
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED: "This field is required",
    EMAIL_INVALID: "Please enter a valid email address",
    MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
    MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
    PASSWORD_MISMATCH: "Passwords do not match",
    FILE_TOO_LARGE: "File size exceeds maximum allowed size",
    INVALID_FILE_TYPE: "Invalid file type",
} as const;

// API Response Messages
export const API_MESSAGES = {
    SUCCESS: "Operation completed successfully",
    ERROR: "An error occurred. Please try again",
    NETWORK_ERROR: "Network error. Please check your connection",
    UNAUTHORIZED: "Unauthorized. Please login again",
    FORBIDDEN: "You do not have permission to perform this action",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Server error. Please try again later",
} as const;
