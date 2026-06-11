import { useQuery } from "@/hooks/useQuery";
import {
  designationsUrl,
  departmentsUrl,
  teachersProfilesUrl,
  classAssignmentsUrl,
  teacherProfileDetailUrl,
} from "@/apis/endpoints/teacher_apis";
import type { TResponse } from "@/types/configs";

export const useDesignationsQuery = () => useQuery<TResponse<any>>(designationsUrl);

export const useDepartmentsQuery = () => useQuery<TResponse<any>>(departmentsUrl);

export const useTeachersProfilesQuery = () => useQuery<TResponse<any>>(teachersProfilesUrl);

export const useTeacherProfileQuery = (id: string) => useQuery<TResponse<any>>(id ? teacherProfileDetailUrl(id) : null);

export const useClassAssignmentsQuery = () => useQuery<TResponse<any>>(classAssignmentsUrl);
