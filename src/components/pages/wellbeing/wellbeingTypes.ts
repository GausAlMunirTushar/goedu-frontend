export type StudentOption = {
    id: string;
    studentId?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    roll?: string;
    class?: { name?: string };
    section?: { name?: string };
    user?: { phone?: string };
};

export type StaffOption = {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
};

export type DisciplineIncidentData = {
    id?: string;
    studentId: string;
    incidentDate: string;
    category: string;
    severity?: string;
    description: string;
    actionTaken?: string;
    status?: string;
    reportedById?: string;
    student?: StudentOption;
    reportedBy?: StaffOption;
    resolvedBy?: StaffOption;
};

export type StudentHealthRecordData = {
    id?: string;
    studentId: string;
    bloodGroup?: string;
    allergies?: string;
    medicalNotes?: string;
    medications?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    doctorName?: string;
    doctorPhone?: string;
    student?: StudentOption;
};

export type CounselingNoteData = {
    id?: string;
    studentId: string;
    noteDate: string;
    concernType?: string;
    summary: string;
    followUpPlan?: string;
    nextFollowUpDate?: string;
    visibility?: string;
    status?: string;
    counselorId?: string;
    student?: StudentOption;
    counselor?: StaffOption;
};

export const studentLabel = (student?: StudentOption) => {
    if (!student) return "-";
    const name = student.fullName || `${student.firstName || ""} ${student.lastName || ""}`.trim();
    const className = student.class?.name ? ` - ${student.class.name}${student.section?.name ? `/${student.section.name}` : ""}` : "";
    return `${name || student.studentId || "Student"}${student.studentId ? ` (${student.studentId})` : ""}${className}`;
};

export const staffLabel = (staff?: StaffOption) => {
    if (!staff) return "-";
    return `${staff.firstName || ""} ${staff.lastName || ""}`.trim() || staff.username || "-";
};

export const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : "-";
