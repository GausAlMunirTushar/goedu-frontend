import { useQuery } from "@/hooks/useQuery";
import {
  examGradesUrl,
  examGradeDetailUrl,
  examSetupsUrl,
  examSetupDetailUrl,
  examSchedulesUrl,
  examScheduleDetailUrl,
  examMarksUrl,
  examResultsUrl,
  examSeatPlansUrl,
} from "@/apis/endpoints/exam_apis";
import type { TResponse } from "@/types/configs";

export const useExamGradesQuery = () =>
  useQuery<TResponse<any>>(examGradesUrl);

export const useExamGradeQuery = (id: string) =>
  useQuery<TResponse<any>>(id ? examGradeDetailUrl(id) : null);

export const useExamsQuery = () =>
  useQuery<TResponse<any>>(examSetupsUrl);

export const useExamQuery = (id: string) =>
  useQuery<TResponse<any>>(id ? examSetupDetailUrl(id) : null);

export const useExamSchedulesQuery = (filters?: {
  examId?: string;
  classId?: string;
  sectionId?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.examId) parts.push(`examId=${filters.examId}`);
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  return useQuery<TResponse<any>>(`${examSchedulesUrl}${queryParams}`);
};

export const useExamScheduleQuery = (id: string) =>
  useQuery<TResponse<any>>(id ? examScheduleDetailUrl(id) : null);

export const useExamMarksQuery = (filters?: {
  examId?: string;
  subjectId?: string;
  classId?: string;
  sectionId?: string;
  sessionId?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.examId) parts.push(`examId=${filters.examId}`);
    if (filters.subjectId) parts.push(`subjectId=${filters.subjectId}`);
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (filters.sessionId) parts.push(`sessionId=${filters.sessionId}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  // If required params are missing, do not trigger fetch
  const shouldFetch = filters?.examId && filters?.subjectId && filters?.classId && filters?.sectionId;
  return useQuery<TResponse<any>>(shouldFetch ? `${examMarksUrl}${queryParams}` : null);
};

export const useExamResultsQuery = (filters?: {
  examId?: string;
  classId?: string;
  sectionId?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.examId) parts.push(`examId=${filters.examId}`);
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  const shouldFetch = filters?.examId && filters?.classId && filters?.sectionId;
  return useQuery<TResponse<any>>(shouldFetch ? `${examResultsUrl}${queryParams}` : null);
};

export const useExamSeatPlansQuery = (filters?: {
  examId?: string;
  classId?: string;
  sectionId?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.examId) parts.push(`examId=${filters.examId}`);
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  const shouldFetch = filters?.examId && filters?.classId && filters?.sectionId;
  return useQuery<TResponse<any>>(shouldFetch ? `${examSeatPlansUrl}${queryParams}` : null);
};
