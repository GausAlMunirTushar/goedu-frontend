// ===== Exam Module Data =====

export const examSessions = [
    { id: "1", name: "2025-2026", status: "Active" },
    { id: "2", name: "2024-2025", status: "Inactive" },
    { id: "3", name: "2023-2024", status: "Inactive" },
];

export const examYears = [
    { id: "1", year: "2026", status: "Active" },
    { id: "2", year: "2025", status: "Inactive" },
    { id: "3", year: "2024", status: "Inactive" },
];

export const examClasses = [
    { id: "1", name: "Class 10", code: "CLS-10" },
    { id: "2", name: "Class 9", code: "CLS-9" },
    { id: "3", name: "Class 8", code: "CLS-8" },
    { id: "4", name: "Class 7", code: "CLS-7" },
    { id: "5", name: "Class 6", code: "CLS-6" },
    { id: "6", name: "Class 5", code: "CLS-5" },
];

export const examSections = [
    { id: "1", name: "Section A", shortName: "A" },
    { id: "2", name: "Section B", shortName: "B" },
    { id: "3", name: "Section C", shortName: "C" },
    { id: "4", name: "Section D", shortName: "D" },
];

export const examList = [
    { id: "1", name: "Mid-Term Examination 2026", type: "Mid-Term", date: "Jun 15, 2026", status: "Upcoming", students: 450 },
    { id: "2", name: "Unit Test - Mathematics", type: "Unit Test", date: "Jun 10, 2026", status: "In Progress", students: 120 },
    { id: "3", name: "Final Exam - Class 10", type: "Final", date: "May 28, 2026", status: "Completed", students: 380 },
    { id: "4", name: "Weekly Quiz - Science", type: "Quiz", date: "May 25, 2026", status: "Completed", students: 95 },
    { id: "5", name: "Pre-Test - English", type: "Pre-Test", date: "May 20, 2026", status: "Completed", students: 210 },
];

export interface SeatEntry {
    seatNo: string;
    studentName: string;
    roll: string;
    className: string;
    section: string;
    fatherName: string;
}

export const seatPlanData: SeatEntry[] = [
    { seatNo: "A-01", studentName: "Rahim Uddin", roll: "101", className: "Class 10", section: "A", fatherName: "Abdul Karim" },
    { seatNo: "A-02", studentName: "Karim Hossain", roll: "102", className: "Class 10", section: "A", fatherName: "Jalal Uddin" },
    { seatNo: "A-03", studentName: "Fatema Akter", roll: "103", className: "Class 10", section: "A", fatherName: "Md. Rafiq" },
    { seatNo: "A-04", studentName: "Nusrat Jahan", roll: "104", className: "Class 10", section: "A", fatherName: "Shahidul Islam" },
    { seatNo: "B-01", studentName: "Shakib Al Hasan", roll: "201", className: "Class 10", section: "A", fatherName: "Nazmul Hasan" },
    { seatNo: "B-02", studentName: "Tamim Iqbal", roll: "202", className: "Class 10", section: "A", fatherName: "Iqbal Hossain" },
    { seatNo: "B-03", studentName: "Mushfiqur Rahim", roll: "203", className: "Class 10", section: "A", fatherName: "Abdur Rahim" },
    { seatNo: "B-04", studentName: "Taskin Ahmed", roll: "204", className: "Class 10", section: "A", fatherName: "Masud Ahmed" },
    { seatNo: "C-01", studentName: "Liton Das", roll: "301", className: "Class 10", section: "A", fatherName: "Sunil Das" },
    { seatNo: "C-02", studentName: "Mehedi Hasan", roll: "302", className: "Class 10", section: "A", fatherName: "Mizanur Rahman" },
    { seatNo: "C-03", studentName: "Nazmul Islam", roll: "303", className: "Class 10", section: "A", fatherName: "Saiful Islam" },
    { seatNo: "C-04", studentName: "Shoriful Islam", roll: "304", className: "Class 10", section: "A", fatherName: "Monir Islam" },
];

export interface AdmitCardEntry {
    id: string;
    studentName: string;
    roll: string;
    registrationNo: string;
    className: string;
    section: string;
    session: string;
    fatherName: string;
    motherName: string;
    dob: string;
    photo: string;
    examName: string;
    examYear: string;
    subjects: { name: string; date: string; time: string }[];
}

export const admitCardData: AdmitCardEntry[] = [
    {
        id: "1",
        studentName: "Rahim Uddin",
        roll: "101",
        registrationNo: "REG-2026-0101",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Abdul Karim",
        motherName: "Rahima Begum",
        dob: "2010-03-15",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
    {
        id: "2",
        studentName: "Karim Hossain",
        roll: "102",
        registrationNo: "REG-2026-0102",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Jalal Uddin",
        motherName: "Salma Khatun",
        dob: "2010-07-22",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
    {
        id: "3",
        studentName: "Fatema Akter",
        roll: "103",
        registrationNo: "REG-2026-0103",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Md. Rafiq",
        motherName: "Hasina Begum",
        dob: "2010-11-05",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
    {
        id: "4",
        studentName: "Nusrat Jahan",
        roll: "104",
        registrationNo: "REG-2026-0104",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Shahidul Islam",
        motherName: "Nasreen Akter",
        dob: "2010-01-18",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
    {
        id: "5",
        studentName: "Shakib Al Hasan",
        roll: "201",
        registrationNo: "REG-2026-0201",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Nazmul Hasan",
        motherName: "Sharmin Sultana",
        dob: "2010-05-30",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
    {
        id: "6",
        studentName: "Tamim Iqbal",
        roll: "202",
        registrationNo: "REG-2026-0202",
        className: "Class 10",
        section: "A",
        session: "2025-2026",
        fatherName: "Iqbal Hossain",
        motherName: "Fatema Khatun",
        dob: "2010-09-12",
        photo: "",
        examName: "Mid-Term Examination",
        examYear: "2026",
        subjects: [
            { name: "Bangla", date: "Jun 15, 2026", time: "10:00 AM" },
            { name: "English", date: "Jun 17, 2026", time: "10:00 AM" },
            { name: "Mathematics", date: "Jun 19, 2026", time: "10:00 AM" },
            { name: "Science", date: "Jun 21, 2026", time: "10:00 AM" },
            { name: "Social Science", date: "Jun 23, 2026", time: "10:00 AM" },
        ],
    },
];

export const examStats = {
    totalExams: 24,
    upcoming: 8,
    completed: 14,
    inProgress: 2,
    resultsPublished: 12,
    pendingReview: 3,
};

// ===== Exam Setup =====
export interface ExamSetupEntry {
    id: string;
    name: string;
    type: string;
    session: string;
    year: string;
    totalMarks: number;
    passMarks: number;
    status: "Active" | "Inactive" | "Draft";
    createdAt: string;
}

export const examSetupData: ExamSetupEntry[] = [
    { id: "1", name: "Mid-Term Examination", type: "Mid-Term", session: "2025-2026", year: "2026", totalMarks: 100, passMarks: 33, status: "Active", createdAt: "Jan 15, 2026" },
    { id: "2", name: "Final Examination", type: "Final", session: "2025-2026", year: "2026", totalMarks: 100, passMarks: 33, status: "Active", createdAt: "Jan 15, 2026" },
    { id: "3", name: "Unit Test - 1", type: "Unit Test", session: "2025-2026", year: "2026", totalMarks: 50, passMarks: 17, status: "Active", createdAt: "Feb 10, 2026" },
    { id: "4", name: "Unit Test - 2", type: "Unit Test", session: "2025-2026", year: "2026", totalMarks: 50, passMarks: 17, status: "Draft", createdAt: "Mar 05, 2026" },
    { id: "5", name: "Pre-Test Examination", type: "Pre-Test", session: "2025-2026", year: "2026", totalMarks: 100, passMarks: 40, status: "Inactive", createdAt: "Apr 01, 2026" },
    { id: "6", name: "Weekly Quiz - 1", type: "Quiz", session: "2025-2026", year: "2026", totalMarks: 20, passMarks: 8, status: "Active", createdAt: "May 12, 2026" },
];

// ===== Exam Schedule =====
export interface ExamScheduleEntry {
    id: string;
    examName: string;
    subject: string;
    className: string;
    section: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    status: "Scheduled" | "Ongoing" | "Completed" | "Postponed";
}

export const examScheduleData: ExamScheduleEntry[] = [
    { id: "1", examName: "Mid-Term Examination", subject: "Bangla", className: "Class 10", section: "A", date: "Jun 15, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 101", status: "Scheduled" },
    { id: "2", examName: "Mid-Term Examination", subject: "English", className: "Class 10", section: "A", date: "Jun 17, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 101", status: "Scheduled" },
    { id: "3", examName: "Mid-Term Examination", subject: "Mathematics", className: "Class 10", section: "A", date: "Jun 19, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 102", status: "Scheduled" },
    { id: "4", examName: "Mid-Term Examination", subject: "Science", className: "Class 10", section: "A", date: "Jun 21, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 103", status: "Scheduled" },
    { id: "5", examName: "Mid-Term Examination", subject: "Social Science", className: "Class 10", section: "A", date: "Jun 23, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 101", status: "Scheduled" },
    { id: "6", examName: "Unit Test - 1", subject: "Mathematics", className: "Class 9", section: "B", date: "May 28, 2026", startTime: "11:00 AM", endTime: "12:30 PM", room: "Room 201", status: "Completed" },
    { id: "7", examName: "Unit Test - 1", subject: "Science", className: "Class 9", section: "B", date: "May 30, 2026", startTime: "11:00 AM", endTime: "12:30 PM", room: "Room 202", status: "Completed" },
    { id: "8", examName: "Final Examination", subject: "Bangla", className: "Class 8", section: "A", date: "Jul 05, 2026", startTime: "10:00 AM", endTime: "01:00 PM", room: "Room 301", status: "Scheduled" },
];

// ===== Mark Entry =====
export interface MarkEntryStudent {
    id: string;
    studentName: string;
    roll: string;
    written: number | null;
    mcq: number | null;
    practical: number | null;
    total: number | null;
    grade: string;
    status: "Entered" | "Pending";
}

export const markEntryStudents: MarkEntryStudent[] = [
    { id: "1", studentName: "Rahim Uddin", roll: "101", written: 45, mcq: 18, practical: 22, total: 85, grade: "A+", status: "Entered" },
    { id: "2", studentName: "Karim Hossain", roll: "102", written: 38, mcq: 15, practical: 19, total: 72, grade: "A", status: "Entered" },
    { id: "3", studentName: "Fatema Akter", roll: "103", written: 48, mcq: 20, practical: 24, total: 92, grade: "A+", status: "Entered" },
    { id: "4", studentName: "Nusrat Jahan", roll: "104", written: 30, mcq: 12, practical: 15, total: 57, grade: "B", status: "Entered" },
    { id: "5", studentName: "Shakib Al Hasan", roll: "201", written: 42, mcq: 17, practical: 20, total: 79, grade: "A", status: "Entered" },
    { id: "6", studentName: "Tamim Iqbal", roll: "202", written: null, mcq: null, practical: null, total: null, grade: "-", status: "Pending" },
    { id: "7", studentName: "Mushfiqur Rahim", roll: "203", written: null, mcq: null, practical: null, total: null, grade: "-", status: "Pending" },
    { id: "8", studentName: "Taskin Ahmed", roll: "204", written: 25, mcq: 10, practical: 12, total: 47, grade: "C", status: "Entered" },
];

export const examSubjects = [
    { id: "1", name: "Bangla" },
    { id: "2", name: "English" },
    { id: "3", name: "Mathematics" },
    { id: "4", name: "Science" },
    { id: "5", name: "Social Science" },
    { id: "6", name: "Religion" },
    { id: "7", name: "ICT" },
];

// ===== Grade Setup =====
export interface GradeEntry {
    id: string;
    gradeName: string;
    gradePoint: number;
    markFrom: number;
    markTo: number;
    remarks: string;
}

export const gradeSetupData: GradeEntry[] = [
    { id: "1", gradeName: "A+", gradePoint: 5.00, markFrom: 80, markTo: 100, remarks: "Outstanding" },
    { id: "2", gradeName: "A", gradePoint: 4.00, markFrom: 70, markTo: 79, remarks: "Excellent" },
    { id: "3", gradeName: "A-", gradePoint: 3.50, markFrom: 60, markTo: 69, remarks: "Very Good" },
    { id: "4", gradeName: "B", gradePoint: 3.00, markFrom: 50, markTo: 59, remarks: "Good" },
    { id: "5", gradeName: "C", gradePoint: 2.00, markFrom: 40, markTo: 49, remarks: "Average" },
    { id: "6", gradeName: "D", gradePoint: 1.00, markFrom: 33, markTo: 39, remarks: "Below Average" },
    { id: "7", gradeName: "F", gradePoint: 0.00, markFrom: 0, markTo: 32, remarks: "Fail" },
];

// ===== Result Processing =====
export interface ResultEntry {
    id: string;
    studentName: string;
    roll: string;
    className: string;
    section: string;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    gpa: number;
    grade: string;
    position: number;
    status: "Pass" | "Fail";
}

export const resultData: ResultEntry[] = [
    { id: "1", studentName: "Fatema Akter", roll: "103", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 462, percentage: 92.4, gpa: 5.00, grade: "A+", position: 1, status: "Pass" },
    { id: "2", studentName: "Rahim Uddin", roll: "101", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 425, percentage: 85.0, gpa: 5.00, grade: "A+", position: 2, status: "Pass" },
    { id: "3", studentName: "Shakib Al Hasan", roll: "201", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 396, percentage: 79.2, gpa: 4.00, grade: "A", position: 3, status: "Pass" },
    { id: "4", studentName: "Karim Hossain", roll: "102", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 362, percentage: 72.4, gpa: 4.00, grade: "A", position: 4, status: "Pass" },
    { id: "5", studentName: "Nusrat Jahan", roll: "104", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 285, percentage: 57.0, gpa: 3.00, grade: "B", position: 5, status: "Pass" },
    { id: "6", studentName: "Taskin Ahmed", roll: "204", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 235, percentage: 47.0, gpa: 2.00, grade: "C", position: 6, status: "Pass" },
    { id: "7", studentName: "Tamim Iqbal", roll: "202", className: "Class 10", section: "A", totalMarks: 500, obtainedMarks: 155, percentage: 31.0, gpa: 0.00, grade: "F", position: 7, status: "Fail" },
];

// ===== GPA Calculation =====
export interface GpaSubjectEntry {
    subject: string;
    totalMarks: number;
    obtainedMarks: number;
    gradePoint: number;
    grade: string;
    credit: number;
}

export const gpaCalculationSample: GpaSubjectEntry[] = [
    { subject: "Bangla", totalMarks: 100, obtainedMarks: 85, gradePoint: 5.00, grade: "A+", credit: 1 },
    { subject: "English", totalMarks: 100, obtainedMarks: 78, gradePoint: 4.00, grade: "A", credit: 1 },
    { subject: "Mathematics", totalMarks: 100, obtainedMarks: 92, gradePoint: 5.00, grade: "A+", credit: 1 },
    { subject: "Science", totalMarks: 100, obtainedMarks: 65, gradePoint: 3.50, grade: "A-", credit: 1 },
    { subject: "Social Science", totalMarks: 100, obtainedMarks: 72, gradePoint: 4.00, grade: "A", credit: 1 },
    { subject: "Religion", totalMarks: 100, obtainedMarks: 88, gradePoint: 5.00, grade: "A+", credit: 1 },
    { subject: "ICT", totalMarks: 100, obtainedMarks: 45, gradePoint: 2.00, grade: "C", credit: 1 },
];
