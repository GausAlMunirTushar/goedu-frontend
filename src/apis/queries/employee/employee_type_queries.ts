import { EmployeeType } from "@/apis/types/hrm/employee_type";
import {
    getEmployeeTypes,
    getEmployeeTypeById,
} from "@/apis/endpoints/employee/employee_type_apis";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";

interface EmployeeTypeListResponse {
    success: boolean;
    message: string;
    data: EmployeeType[];
    meta?: {
        current_page: number;
        last_page: number;
        page_size: number;
        total_count: number;
    };
}

interface EmployeeTypeDetailResponse {
    success: boolean;
    message: string;
    data: EmployeeType;
}

export const useEmployeeTypesListQuery = (
    initialPage = 1,
    initialPerPage = 20,
    initialSearch = "",
) => {
    return usePaginatedQuery<EmployeeType>(getEmployeeTypes, {
        initialPage,
        initialPerPage,
        initialSearch,
    });
};

export const useEmployeeTypeDetailQuery = (id: number) => {
    return useQuery<TResponse<EmployeeType>>(id ? getEmployeeTypeById(id) : null);
};
