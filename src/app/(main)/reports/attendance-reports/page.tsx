import { AttendanceReports } from "@/components/pages/reports/AttendanceReports";

export const metadata = {
  title: "Attendance Reports | ePathshala",
  description: "View historical attendance records and percentages.",
};

export default function Page() {
  return <AttendanceReports />;
}
