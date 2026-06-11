// Teacher Designations API Endpoints
export const designationsUrl = "/teacher/designations";
export const designationDetailUrl = (id: string) => `/teacher/designations/${id}`;

// Teacher Departments API Endpoints
export const departmentsUrl = "/teacher/departments";
export const departmentDetailUrl = (id: string) => `/teacher/departments/${id}`;

// Teacher Profiles API Endpoints
export const teachersProfilesUrl = "/teacher/profiles";
export const teacherProfileDetailUrl = (id: string) => `/teacher/profiles/${id}`;

// Class Teacher Assignments API Endpoints
export const classAssignmentsUrl = "/teacher/class-assignments";
export const classAssignmentDetailUrl = (id: string) => `/teacher/class-assignments/${id}`;
