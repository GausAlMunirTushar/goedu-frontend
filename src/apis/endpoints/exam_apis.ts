export const examGradesUrl = "/exam/grades";
export const examGradeDetailUrl = (id: string) => `/exam/grades/${id}`;

export const examSetupsUrl = "/exam/setups";
export const examSetupDetailUrl = (id: string) => `/exam/setups/${id}`;

export const examSchedulesUrl = "/exam/schedules";
export const examScheduleDetailUrl = (id: string) => `/exam/schedules/${id}`;

export const examMarksUrl = "/exam/marks";
export const examResultsUrl = "/exam/results";
export const examSeatPlansUrl = "/exam/seat-plans";
export const examDashboardUrl = "/exam/dashboard-stats";

export const exportAdmitCardsPdfUrl = "/exam/admit-cards/export/pdf";
export const exportSeatPlansPdfUrl = "/exam/seat-plans/export/pdf";

export const examTabulationSheetUrl = "/exam/results/tabulation-sheet";
export const examMarksheetUrl = "/exam/results/marksheet";
export const publishExamResultUrl = (examId: string) => `/exam/results/${examId}/publish`;
