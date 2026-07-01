import { useQuery } from "@/hooks/useQuery";
import {
  studentDocumentsUrl,
  studentsProfilesUrl,
  studentProfileDetailUrl,
  studentTransfersUrl,
} from "@/apis/endpoints/student_apis";
import type { TResponse } from "@/types/configs";

export const useStudentProfilesQuery = (filters?: {
  classId?: string;
  sectionId?: string;
  sessionId?: string;
  status?: string;
  search?: string;
}) => {
  let queryParams = "";
  if (filters) {
    const parts = [];
    if (filters.classId) parts.push(`classId=${filters.classId}`);
    if (filters.sectionId) parts.push(`sectionId=${filters.sectionId}`);
    if (filters.sessionId) parts.push(`sessionId=${filters.sessionId}`);
    if (filters.status) parts.push(`status=${filters.status}`);
    if (filters.search) parts.push(`search=${filters.search}`);
    if (parts.length > 0) {
      queryParams = "?" + parts.join("&");
    }
  }
  return useQuery<TResponse<any>>(`${studentsProfilesUrl}${queryParams}`);
};

export const useStudentProfileQuery = (id: string) =>
  useQuery<TResponse<any>>(id ? studentProfileDetailUrl(id) : null);

export const useStudentDocumentsQuery = (studentId?: string) =>
  useQuery<TResponse<any[]>>(studentId ? `${studentDocumentsUrl}?studentId=${studentId}` : null);

export const useStudentTransfersQuery = (studentId?: string) =>
  useQuery<TResponse<any[]>>(studentId ? `${studentTransfersUrl}?studentId=${studentId}` : null);
