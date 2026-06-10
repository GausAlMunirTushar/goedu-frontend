import { useQuery } from "@/hooks/useQuery";
import {
    academicYearsUrl,
    classesUrl,
    sectionsUrl,
    subjectsUrl,
    routinesUrl,
} from "@/apis/endpoints/academic_apis";
import type { TResponse } from "@/types/configs";

export const useAcademicYearsQuery = () => useQuery<TResponse<any>>(academicYearsUrl);

export const useClassesQuery = () => useQuery<TResponse<any>>(classesUrl);

export const useSectionsQuery = (classId?: string) => 
    useQuery<TResponse<any>>(classId ? `${sectionsUrl}?classId=${classId}` : sectionsUrl);

export const useSubjectsQuery = (classId?: string) => 
    useQuery<TResponse<any>>(classId ? `${subjectsUrl}?classId=${classId}` : subjectsUrl);

export const useRoutinesQuery = (filter?: {
    classId?: string;
    sectionId?: string;
    teacherId?: string;
    academicYearId?: string;
    dayOfWeek?: string;
}) => {
    let queryParams = "";
    if (filter) {
        const parts = [];
        if (filter.classId) parts.push(`classId=${filter.classId}`);
        if (filter.sectionId) parts.push(`sectionId=${filter.sectionId}`);
        if (filter.teacherId) parts.push(`teacherId=${filter.teacherId}`);
        if (filter.academicYearId) parts.push(`academicYearId=${filter.academicYearId}`);
        if (filter.dayOfWeek) parts.push(`dayOfWeek=${filter.dayOfWeek}`);
        if (parts.length > 0) {
            queryParams = "?" + parts.join("&");
        }
    }
    return useQuery<TResponse<any>>(`${routinesUrl}${queryParams}`);
};
