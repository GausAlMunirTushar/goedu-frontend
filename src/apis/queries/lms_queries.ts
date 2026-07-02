import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import { classResourcesUrl, homeworkSubmissionsUrl, homeworksUrl, lessonPlansUrl, lmsDashboardUrl } from "../endpoints/lms_apis";

export const useLmsDashboardQuery = () => useQuery<TResponse<any>>(lmsDashboardUrl);
export const useLessonPlansQuery = () => useQuery<TResponse<any>>(lessonPlansUrl);
export const useHomeworksQuery = () => useQuery<TResponse<any>>(homeworksUrl);
export const useHomeworkSubmissionsQuery = () => useQuery<TResponse<any>>(homeworkSubmissionsUrl);
export const useClassResourcesQuery = () => useQuery<TResponse<any>>(classResourcesUrl);
