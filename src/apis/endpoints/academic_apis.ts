// Academic Years API Endpoints
export const academicYearsUrl = "/academic/years";
export const academicYearDetailUrl = (id: string) => `/academic/years/${id}`;

// Classes API Endpoints
export const classesUrl = "/academic/classes";
export const classDetailUrl = (id: string) => `/academic/classes/${id}`;

// Sections API Endpoints
export const sectionsUrl = "/academic/sections";
export const sectionDetailUrl = (id: string) => `/academic/sections/${id}`;

// Subjects API Endpoints
export const subjectsUrl = "/academic/subjects";
export const subjectDetailUrl = (id: string) => `/academic/subjects/${id}`;

// Class Routines API Endpoints
export const routinesUrl = "/academic/routines";
export const routineDetailUrl = (id: string) => `/academic/routines/${id}`;

// Sessions API Endpoints
export const sessionsUrl = "/academic/sessions";
export const sessionDetailUrl = (id: string) => `/academic/sessions/${id}`;

// Groups API Endpoints
export const groupsUrl = "/academic/groups";
export const groupDetailUrl = (id: string) => `/academic/groups/${id}`;

// Shifts API Endpoints
export const shiftsUrl = "/academic/shifts";
export const shiftDetailUrl = (id: string) => `/academic/shifts/${id}`;

// Rooms API Endpoints
export const roomsUrl = "/academic/rooms";
export const roomDetailUrl = (id: string) => `/academic/rooms/${id}`;

// Admissions API Endpoints
export const admissionsUrl = "/academic/admissions";
export const admissionDetailUrl = (id: string) => `/academic/admissions/${id}`;

// Subject Assignments API Endpoints
export const subjectAssignmentsUrl = "/academic/subject-assignments";
export const subjectAssignmentDetailUrl = (classId: string, sectionId: string, shiftId: string) => 
    `/academic/subject-assignments/${classId}/${sectionId}/${shiftId}`;

// Teacher Mappings API Endpoints
export const teacherMappingsUrl = "/academic/teacher-mappings";
export const teacherMappingDetailUrl = (id: string) => `/academic/teacher-mappings/${id}`;

