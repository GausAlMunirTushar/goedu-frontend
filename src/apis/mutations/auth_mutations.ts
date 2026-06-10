import {
    authLogin,
    authTokenRefresh,
    changePassword,
    forgotPassword,
    logout,
    resetPassword,
} from "@/apis/endpoints/auth_apis";
import { useForm, type InitialOptions } from "@/hooks/useForm";

export type LoginFormType = {
    username: string | InitialOptions;
    password: string | InitialOptions;
    remember_me: boolean;
};

export type RefreshTokenFormType = {
    refresh: string | InitialOptions;
};

export type LogoutFormType = {
    refresh: string | InitialOptions;
};

export type ForgotPasswordFormType = {
    identifier: string | InitialOptions;
};

export type ResetPasswordFormType = {
    token: string | InitialOptions;
    password: string | InitialOptions;
    confirmPassword: string | InitialOptions;
};

export type ChangePasswordFormType = {
    oldPassword: string | InitialOptions;
    newPassword: string | InitialOptions;
    confirmPassword: string | InitialOptions;
};

export const useLoginMutation = () =>
    useForm<LoginFormType>(
        authLogin,
        {
            username: {
                value: "",
                validation: "required",
            },
            password: {
                value: "",
                validation: "required|min:6",
            },
            remember_me: false,
        },
        {
            method: "POST",
        },
    );

export const useRefreshTokenMutation = () =>
    useForm<RefreshTokenFormType>(
        authTokenRefresh,
        {
            refresh: {
                value: "",
                validation: "required",
            },
        },
        {
            method: "POST",
        },
    );

export const useLogoutMutation = () =>
    useForm<LogoutFormType>(
        logout,
        {
            refresh: {
                value: "",
                validation: "required",
            },
        },
        {
            method: "POST",
        },
    );

export const useForgotPasswordMutation = () =>
    useForm<ForgotPasswordFormType>(
        forgotPassword,
        {
            identifier: {
                value: "",
                validation: "required",
            },
        },
        {
            method: "POST",
        },
    );

export const useResetPasswordMutation = () =>
    useForm<ResetPasswordFormType>(
        resetPassword,
        {
            token: {
                value: "",
                validation: "required",
            },
            password: {
                value: "",
                validation: "required|min:6",
            },
            confirmPassword: {
                value: "",
                validation: "required|confirmed:password",
            },
        },
        {
            method: "POST",
        },
    );

export const useChangePasswordMutation = () =>
    useForm<ChangePasswordFormType>(
        changePassword,
        {
            oldPassword: {
                value: "",
                validation: "required|min:6",
            },
            newPassword: {
                value: "",
                validation: "required|min:6",
            },
            confirmPassword: {
                value: "",
                validation: "required|confirmed:newPassword",
            },
        },
        {
            method: "POST",
        },
    );
