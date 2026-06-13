import { AxiosAPI } from "@/apis/configs";
import { studentAttendanceUrl, employeeAttendanceUrl } from "@/apis/endpoints/attendance_apis";

export const saveStudentAttendanceBulk = async (payload: {
  date: string;
  classId: string;
  sectionId: string;
  sessionId?: string;
  attendance: {
    studentId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
    remarks?: string;
  }[];
}) => {
  const res = await AxiosAPI.post(studentAttendanceUrl, payload);
  return res.data;
};

export const saveEmployeeAttendanceBulk = async (payload: {
  date: string;
  attendance: {
    userId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
    inTime?: string | null;
    outTime?: string | null;
    remarks?: string | null;
  }[];
}) => {
  const res = await AxiosAPI.post(employeeAttendanceUrl, payload);
  return res.data;
};
