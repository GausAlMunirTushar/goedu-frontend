import { useQuery } from "@/hooks/useQuery";
import { 
  attendanceReportUrl, 
  resultReportUrl, 
  studentReportUrl, 
  teacherReportUrl 
} from "@/apis/endpoints/reports_apis";
import type { TResponse } from "@/types/configs";

export const useAttendanceReportQuery = (filters: {
  startDate: string;
  endDate: string;
  classId?: string;
  status?: string;
  searchQuery?: string;
}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.classId && filters.classId !== "All Classes") params.append("classId", filters.classId);
  if (filters.status && filters.status !== "All Status") params.append("status", filters.status.toUpperCase());
  if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);

  const shouldFetch = !!(filters.startDate && filters.endDate);
  return useQuery<TResponse<any>>(shouldFetch ? `${attendanceReportUrl}?${params.toString()}` : null);
};

export const useResultReportQuery = (filters: {
  examId?: string;
  classId?: string;
  sessionId?: string;
  status?: string;
  searchQuery?: string;
}) => {
  const params = new URLSearchParams();
  if (filters.examId && filters.examId !== "All Exams") params.append("examId", filters.examId);
  if (filters.classId && filters.classId !== "All Classes") params.append("classId", filters.classId);
  if (filters.sessionId && filters.sessionId !== "All Sessions") params.append("sessionId", filters.sessionId);
  if (filters.status && filters.status !== "All") params.append("status", filters.status.toUpperCase());
  if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);

  return useQuery<TResponse<any>>(`${resultReportUrl}?${params.toString()}`);
};

export const useStudentReportQuery = (filters: {
  classId?: string;
  sessionId?: string;
  status?: string;
  searchQuery?: string;
}) => {
  const params = new URLSearchParams();
  if (filters.classId && filters.classId !== "All Classes") params.append("classId", filters.classId);
  if (filters.sessionId && filters.sessionId !== "All Sessions") params.append("sessionId", filters.sessionId);
  if (filters.status && filters.status !== "All Status") params.append("status", filters.status);
  if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);

  return useQuery<TResponse<any>>(`${studentReportUrl}?${params.toString()}`);
};

export const useTeacherReportQuery = (filters: {
  designationId?: string;
  departmentId?: string;
  status?: string;
  searchQuery?: string;
}) => {
  const params = new URLSearchParams();
  if (filters.designationId && filters.designationId !== "All Designations") params.append("designationId", filters.designationId);
  if (filters.departmentId && filters.departmentId !== "All Departments") params.append("departmentId", filters.departmentId);
  if (filters.status && filters.status !== "All Status") params.append("status", filters.status);
  if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);

  return useQuery<TResponse<any>>(`${teacherReportUrl}?${params.toString()}`);
};
