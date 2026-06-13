import { useQuery } from "@/hooks/useQuery";
import { studentAttendanceUrl, employeeAttendanceUrl } from "@/apis/endpoints/attendance_apis";
import type { TResponse } from "@/types/configs";

export const useStudentAttendanceQuery = (filters?: {
  date?: string;
  classId?: string;
  sectionId?: string;
  sessionId?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.date) parts.push(`date=${filters.date}`);
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (filters.sessionId) parts.push(`sessionId=${filters.sessionId}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  const shouldFetch = filters?.date && filters?.classId && filters?.sectionId;
  return useQuery<TResponse<any>>(shouldFetch ? `${studentAttendanceUrl}${queryParams}` : null);
};

export const useEmployeeAttendanceQuery = (filters?: { date?: string }) => {
  let queryParams = "";
  if (filters?.date) {
    queryParams = `?date=${filters.date}`;
  }
  const shouldFetch = !!filters?.date;
  return useQuery<TResponse<any>>(shouldFetch ? `${employeeAttendanceUrl}${queryParams}` : null);
};
