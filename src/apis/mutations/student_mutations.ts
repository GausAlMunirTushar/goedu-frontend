import { AxiosAPI } from "@/apis/configs";
import {
  studentsProfilesUrl,
  studentProfileDetailUrl,
  studentPromoteUrl,
  studentIdCardPdfUrl,
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

export const downloadStudentIdCard = async (id: string, name: string) => {
  const res = await AxiosAPI.get(studentIdCardPdfUrl(id), {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `ID_Card_${name.replace(/\s+/g, "_")}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
