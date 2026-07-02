import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import { counselingNotesUrl, disciplineIncidentsUrl, healthRecordDetailUrl, healthRecordsUrl, wellbeingDashboardUrl } from "../endpoints/wellbeing_apis";

export const useWellbeingDashboardQuery = () => useQuery<TResponse<any>>(wellbeingDashboardUrl);
export const useDisciplineIncidentsQuery = () => useQuery<TResponse<any[]>>(disciplineIncidentsUrl);
export const useHealthRecordsQuery = () => useQuery<TResponse<any[]>>(healthRecordsUrl);
export const useHealthRecordQuery = (studentId?: string) => useQuery<TResponse<any>>(studentId ? healthRecordDetailUrl(studentId) : null);
export const useCounselingNotesQuery = () => useQuery<TResponse<any[]>>(counselingNotesUrl);
