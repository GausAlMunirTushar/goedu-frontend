import { useCallback, useMemo, useState } from "react";

import { useQuery } from "@/hooks/useQuery";

import type { SWRConfig } from "@/types/configs";

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        count: number;
        next: number | null;
        previous: number | null;
        page_size: number;
        current_page: number;
        total_pages: number;
    };
}

// Options type
interface PaginatedOptions {
    initialPage?: number;
    initialPerPage?: number;
    initialClassId?: number | null;
    initialQ?: string;
    initialCategory?: string | null;
    initialDate?: string | null;
    initialStatus?: string | null;
    initialEmployeeId?: string | null;
    initialDepartment?: string | null; // Maps to code parameter
    initialDepartmentId?: number | null; // Maps to department ID parameter
    initialPeriod?: string | null;
    initialType?: string | null;
    initialSearch?: string | null;
    initialFaculty?: number | null;
    initialOrdering?: string | null;
    initialIsActive?: boolean | null;
    initialIsStaff?: boolean | null;
    initialMonth?: number | null;
    initialYear?: number | null;
    swrConfig?: SWRConfig;
}

export function usePaginatedQuery<T>(
    url: string,
    {
        initialPage = 1,
        initialPerPage = 20,
        initialClassId = null,
        initialQ = "",
        initialCategory = null,
        initialDate = null,
        initialStatus = null,
        initialEmployeeId = null,
        initialDepartment = null,
        initialDepartmentId = null,
        initialPeriod = null,
        initialType = null,
        initialSearch = null,
        initialFaculty = null,
        initialOrdering = null,
        initialIsActive = null,
        initialIsStaff = null,
        initialMonth = null,
        initialYear = null,
        swrConfig,
    }: PaginatedOptions = {},
) {
    // Track pagination + filters in state
    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [classId, setClassId] = useState<number | null>(initialClassId);
    const [search, setSearch] = useState<string>(initialQ);
    const [category, setCategory] = useState<string | null>(initialCategory);
    const [date, setDate] = useState<string | null>(initialDate);
    const [status, setStatus] = useState<string | null>(initialStatus);
    const [employeeId, setEmployeeId] = useState<string | null>(initialEmployeeId);
    const [department, setDepartment] = useState<string | null>(initialDepartment); // This maps to code
    const [departmentId, setDepartmentId] = useState<number | null>(initialDepartmentId); // This maps to department ID
    const [period, setPeriod] = useState<string | null>(initialPeriod);
    const [type, setType] = useState<string | null>(initialType);
    const [searchParam, setSearchParam] = useState<string | null>(initialSearch);
    const [faculty, setFaculty] = useState<number | null>(initialFaculty);
    const [ordering, setOrdering] = useState<string | null>(initialOrdering);
    const [isActive, setIsActive] = useState<boolean | null>(initialIsActive);
    const [isStaff, setIsStaff] = useState<boolean | null>(initialIsStaff);
    const [month, setMonth] = useState<number | null>(initialMonth);
    const [year, setYear] = useState<number | null>(initialYear);

    // Build the final URL with query params
    const paginatedUrl = useMemo(() => {
        let urlWithParams = `${url}?page=${page}&page_size=${perPage}`;

        if (classId) {
            urlWithParams += `&filter_by_class_id=${classId}`;
        }
        if (search) {
            urlWithParams += `&search=${encodeURIComponent(search)}`;
        }
        if (category) {
            urlWithParams += `&category=${category}`;
        }
        if (date) {
            urlWithParams += `&date=${encodeURIComponent(date)}`;
        }
        if (status) {
            urlWithParams += `&status=${encodeURIComponent(status)}`;
        }
        if (employeeId) {
            urlWithParams += `&employee_id=${encodeURIComponent(employeeId)}`;
        }
        if (department) {
            urlWithParams += `&code=${encodeURIComponent(department)}`;
        }
        if (departmentId) {
            urlWithParams += `&department=${departmentId}`;
        }
        if (period) {
            urlWithParams += `&period=${encodeURIComponent(period)}`;
        }
        if (type) {
            urlWithParams += `&type=${encodeURIComponent(type)}`;
        }
        if (searchParam) {
            urlWithParams += `&search=${encodeURIComponent(searchParam)}`;
        }
        if (faculty) {
            urlWithParams += `&faculty=${faculty}`;
        }
        if (ordering) {
            urlWithParams += `&ordering=${encodeURIComponent(ordering)}`;
        }
        if (isActive !== null && isActive !== undefined) {
            urlWithParams += `&is_active=${isActive}`;
        }
        if (isStaff !== null && isStaff !== undefined) {
            urlWithParams += `&is_staff=${isStaff}`;
        }
        if (month !== null && month !== undefined) {
            urlWithParams += `&month=${month}`;
        }
        if (year !== null && year !== undefined) {
            urlWithParams += `&year=${year}`;
        }

        return urlWithParams;
    }, [
        url,
        page,
        perPage,
        classId,
        search,
        category,
        date,
        status,
        employeeId,
        department,
        departmentId,
        period,
        type,
        searchParam,
        faculty,
        ordering,
        isActive,
        isStaff,
        month,
        year,
    ]);

    // Fetch with existing useQuery
    const { data, error, isLoading, mutate } = useQuery<PaginatedResponse<T>>(
        paginatedUrl,
        swrConfig,
    );

    // Extract paginated fields
    const paginatedData = data?.data || [];

    const currentPage = data?.pagination?.current_page ?? 1;
    const lastPage = data?.pagination?.total_pages ?? 1;
    const pageSize = perPage;
    const totalCount = data?.pagination?.count ?? 0;

    // Navigation helpers
    const nextPage = useCallback(() => {
        if (currentPage < lastPage) setPage((p) => p + 1);
    }, [currentPage, lastPage]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) setPage((p) => p - 1);
    }, [currentPage]);

    const goToPage = useCallback(
        (pageNum: number) => {
            if (pageNum >= 1 && pageNum <= lastPage) {
                setPage(pageNum);
            }
        },
        [lastPage],
    );

    const setPageSize = useCallback((newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(1);
    }, []);

    return {
        data: paginatedData,
        isLoading,
        error,

        // backend truth
        currentPage,
        lastPage,
        pageSize,
        totalCount,

        // setters
        setPage,
        setPageSize,
        nextPage,
        prevPage,
        goToPage,
        mutate,

        setClassId,
        setSearch,
        classId,
        search,
        setCategory,
        setDate,
        setStatus,
        setEmployeeId,
        setDepartment,
        setDepartmentId,
        setPeriod,
        setType,
        setSearchParam,
        setFaculty,
        setIsActive,
        setIsStaff,
        setOrdering,
        setMonth,
        setYear,
        date,
        status,
        employeeId,
        department,
        departmentId,
        period,
        type,
        searchParam,
        faculty,
        isActive,
        isStaff,
        ordering,
        month,
        year,
    };
}
