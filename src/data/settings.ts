export const roles = [
    { id: "1", name: "Super Admin", code: "SUPER_ADMIN", description: "Full access to all system features", status: "Active" },
    { id: "2", name: "Admin", code: "ADMIN", description: "Administrative access to most features", status: "Active" },
    { id: "3", name: "Teacher", code: "TEACHER", description: "Access to academic and student related data", status: "Active" },
    { id: "4", name: "Student", code: "STUDENT", description: "Access to personal academic records", status: "Active" },
    { id: "5", name: "Parent", code: "PARENT", description: "Access to child's academic records", status: "Active" },
    { id: "6", name: "Librarian", code: "LIBRARIAN", description: "Access to library management system", status: "Inactive" },
];

export const users = [
    { id: "1", name: "Admin User", email: "admin@epathshala.com", role: "Super Admin", status: "Active", last_login: "2026-06-09 10:30 AM" },
    { id: "2", name: "John Doe", email: "john.teacher@epathshala.com", role: "Teacher", status: "Active", last_login: "2026-06-08 04:15 PM" },
    { id: "3", name: "Jane Smith", email: "jane.admin@epathshala.com", role: "Admin", status: "Active", last_login: "2026-06-09 09:00 AM" },
    { id: "4", name: "Michael Scott", email: "michael.scott@epathshala.com", role: "Teacher", status: "Inactive", last_login: "2026-05-20 11:20 AM" },
    { id: "5", name: "Robert California", email: "robert@epathshala.com", role: "Admin", status: "Active", last_login: "2026-06-07 02:45 PM" },
];

export const permissions = [
    { id: "1", name: "Dashboard View", code: "DASHBOARD_VIEW", module: "Dashboard" },
    { id: "2", name: "Academic Access", code: "ACADEMIC_MODULE_ACCESS", module: "Academic" },
    { id: "3", name: "Student Access", code: "STUDENT_MODULE_ACCESS", module: "Student" },
    { id: "4", name: "Teacher Access", code: "TEACHER_MODULE_ACCESS", module: "Teacher" },
    { id: "5", name: "Attendance Access", code: "ATTENDANCE_MODULE_ACCESS", module: "Attendance" },
    { id: "6", name: "Examination Access", code: "EXAMINATION_MODULE_ACCESS", module: "Examination" },
    { id: "7", name: "Settings Access", code: "SETTINGS_MODULE_ACCESS", module: "Settings" },
];

export const rolePermissions = [
    { role_id: "2", permission_ids: ["1", "2", "3", "4", "5"] },
    { role_id: "3", permission_ids: ["1", "2", "3"] },
];
