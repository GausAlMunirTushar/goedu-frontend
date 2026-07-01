import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import {
    libraryBooksUrl,
    libraryCategoriesUrl,
    libraryDashboardUrl,
    libraryIssuesUrl,
    librarySettingsUrl,
    libraryShelvesUrl,
} from "../endpoints/library_apis";

const withParams = (url: string, params?: Record<string, string | undefined>) => {
    if (!params) return url;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
    });
    return query.toString() ? `${url}?${query.toString()}` : url;
};

export const useLibraryDashboardQuery = () => useQuery<TResponse<any>>(libraryDashboardUrl);

export const useLibraryCategoriesQuery = () => useQuery<TResponse<any>>(libraryCategoriesUrl);

export const useLibraryShelvesQuery = () => useQuery<TResponse<any>>(libraryShelvesUrl);

export const useLibraryBooksQuery = (params?: {
    search?: string;
    categoryId?: string;
    status?: string;
}) => useQuery<TResponse<any>>(withParams(libraryBooksUrl, params));

export const useLibraryIssuesQuery = (params?: {
    status?: string;
    studentId?: string;
}) => useQuery<TResponse<any>>(withParams(libraryIssuesUrl, params));

export const useLibrarySettingsQuery = () => useQuery<TResponse<any>>(librarySettingsUrl);
