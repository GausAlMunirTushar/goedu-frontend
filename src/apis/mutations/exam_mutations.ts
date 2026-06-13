import { AxiosAPI } from "@/apis/configs";
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

// ==========================================
// GRADES MUTATIONS
// ==========================================
export const createExamGrade = async (payload: any) => {
  const res = await AxiosAPI.post(examGradesUrl, payload);
  return res.data;
};

export const updateExamGrade = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(examGradeDetailUrl(id), payload);
  return res.data;
};

export const deleteExamGrade = async (id: string) => {
  const res = await AxiosAPI.delete(examGradeDetailUrl(id));
  return res.data;
};

// ==========================================
// EXAMS MUTATIONS
// ==========================================
export const createExam = async (payload: any) => {
  const res = await AxiosAPI.post(examSetupsUrl, payload);
  return res.data;
};

export const updateExam = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(examSetupDetailUrl(id), payload);
  return res.data;
};

export const deleteExam = async (id: string) => {
  const res = await AxiosAPI.delete(examSetupDetailUrl(id));
  return res.data;
};

// ==========================================
// SCHEDULES MUTATIONS
// ==========================================
export const createExamSchedule = async (payload: any) => {
  const res = await AxiosAPI.post(examSchedulesUrl, payload);
  return res.data;
};

export const updateExamSchedule = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(examScheduleDetailUrl(id), payload);
  return res.data;
};

export const deleteExamSchedule = async (id: string) => {
  const res = await AxiosAPI.delete(examScheduleDetailUrl(id));
  return res.data;
};

// ==========================================
// MARKS MUTATIONS
// ==========================================
export const saveExamMarks = async (payload: { examId: string; subjectId: string; marks: any[] }) => {
  const res = await AxiosAPI.post(examMarksUrl, payload);
  return res.data;
};

// ==========================================
// RESULTS MUTATIONS
// ==========================================
export const processExamResults = async (payload: { examId: string; classId: string; sectionId: string }) => {
  const res = await AxiosAPI.post(examResultsUrl, payload);
  return res.data;
};

export const publishExamResult = async (examId: string) => {
  const res = await AxiosAPI.post(`/exam/results/${examId}/publish`);
  return res.data;
};

// ==========================================
// SEAT PLANS MUTATIONS
// ==========================================
export const generateSeatPlan = async (payload: { examId: string; classId: string; sectionId: string; seatPrefix?: string }) => {
  const res = await AxiosAPI.post(examSeatPlansUrl, payload);
  return res.data;
};
