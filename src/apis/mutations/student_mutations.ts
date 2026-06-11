import { AxiosAPI } from "@/apis/configs";
import {
  studentsProfilesUrl,
  studentProfileDetailUrl,
  studentPromoteUrl,
} from "@/apis/endpoints/student_apis";

export const createStudentProfile = async (payload: any) => {
  const res = await AxiosAPI.post(studentsProfilesUrl, payload);
  return res.data;
};

export const updateStudentProfile = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(studentProfileDetailUrl(id), payload);
  return res.data;
};

export const deleteStudentProfile = async (id: string) => {
  const res = await AxiosAPI.delete(studentProfileDetailUrl(id));
  return res.data;
};

export const promoteStudents = async (payload: any) => {
  const res = await AxiosAPI.post(studentPromoteUrl, payload);
  return res.data;
};
