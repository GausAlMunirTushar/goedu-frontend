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
    refresh: string;
};

export type LogoutFormType = {
    refresh_token: string;
};

export type ForgotPasswordFormType = {
    email: string | InitialOptions;
};

export type ResetPasswordFormType = {
    uid: string | InitialOptions;
    token: string | InitialOptions;
    new_password: string | InitialOptions;
    re_new_password: string | InitialOptions;
};

export type ChangePasswordFormType = {
    old_password: string | InitialOptions;
    new_password: string | InitialOptions;
    confirm_password: string | InitialOptions;
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
            refresh_token: "",
        },
        {
            method: "POST",
        },
    );

export const useForgotPasswordMutation = () =>
    useForm<ForgotPasswordFormType>(
        forgotPassword,
        {
            email: {
                value: "",
                validation: "required|email",
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
            uid: {
                value: "",
                validation: "required",
            },
            token: {
                value: "",
                validation: "required",
            },
            new_password: {
                value: "",
                validation: "required|min:8",
            },
            re_new_password: {
                value: "",
                validation: "required|same:new_password",
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
            old_password: {
                value: "",
                validation: "required|min:6",
            },
            new_password: {
                value: "",
                validation: "required|min:8",
            },
            confirm_password: {
                value: "",
                validation: "required|confirmed:new_password",
            },
        },
        {
            method: "POST",
        },
    );
