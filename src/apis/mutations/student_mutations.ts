import { AxiosAPI } from "@/apis/configs";
import {
  studentDocumentDetailUrl,
  studentDocumentsUrl,
  studentsProfilesUrl,
  studentProfileDetailUrl,
  studentPromoteUrl,
  studentIdCardPdfUrl,
  studentTransfersUrl,
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

export const createStudentDocument = async (payload: {
  studentId: string;
  type: string;
  fileName: string;
  fileUrl?: string;
  fileSize?: string;
  mimeType?: string;
  note?: string;
}) => {
  const res = await AxiosAPI.post(studentDocumentsUrl, payload);
  return res.data;
};

export const deleteStudentDocument = async (id: string) => {
  const res = await AxiosAPI.delete(studentDocumentDetailUrl(id));
  return res.data;
};

export const processStudentTransfer = async (payload: {
  studentId: string;
  destinationInstitution: string;
  reason: string;
  transferDate: string;
}) => {
  const res = await AxiosAPI.post(studentTransfersUrl, payload);
  return res.data;
};
