import {
    employeeList,
    employeeDetail,
    employeeMe,
    getEmployeeSalaries,
    downloadPayslip,
    salaryCertificateRequestList,
} from "@/apis/endpoints/employee/employee_apis";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useQuery } from "@/hooks/useQuery";
import {
    Employee,
    EmployeeDetail,
    EmployeeSalary,
    EmployeeSalaryListResponse,
    SalaryCertificateRequest,
    SalaryCertificateRequestListResponse,
} from "@/apis/types/employee_type";
import type { TResponse } from "@/types/configs";

export const useEmployeesQuery = (
    initialPage = 1,
    initialPerPage = 30,
    initialDepartment: string | null = null,
    initialQ = "",
) =>
    usePaginatedQuery<Employee>(employeeList, {
        initialPage,
        initialPerPage,
        initialDepartment,
        initialQ,
    });

export const useEmployeeDetailQuery = (id: number | null | undefined) =>
    useQuery<TResponse<EmployeeDetail>>(id ? employeeDetail(id) : null);

export const useEmployeeMeQuery = () => useQuery<TResponse<EmployeeDetail>>(employeeMe);

// Export alias for useEmployeesListQuery to match expected import
export const useEmployeesListQuery = (
    initialPage = 1,
    initialPerPage = 30,
    initialDepartment: string | null = null,
    initialQ = "",
) => useEmployeesQuery(initialPage, initialPerPage, initialDepartment, initialQ);

// Employee Salaries Query
export const useEmployeeSalariesQuery = (
    initialPage = 1,
    initialPerPage = 20,
    initialMonth?: number | null,
    initialYear?: number | null,
    initialStatus?: string | null,
) =>
    usePaginatedQuery<EmployeeSalary>(getEmployeeSalaries, {
        initialPage,
        initialPerPage,
        initialMonth,
        initialYear,
        initialStatus,
    });

// Salary Certificate Request Query
export const useSalaryCertificateRequestsQuery = (
    initialPage = 1,
    initialPerPage = 20,
    initialStatus?: string | null,
) =>
    usePaginatedQuery<SalaryCertificateRequest>(salaryCertificateRequestList, {
        initialPage,
        initialPerPage,
        initialStatus,
    });
