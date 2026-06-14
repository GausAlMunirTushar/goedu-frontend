// Student Profiles API Endpoints
export const studentsProfilesUrl = "/student/profiles";
export const studentProfileDetailUrl = (id: string) => `/student/profiles/${id}`;

// Student Promotion API Endpoints
export const studentPromoteUrl = "/student/promote";

// Student ID Card API Endpoints
export const studentIdCardPdfUrl = (id: string) => `/student/profiles/${id}/id-card/pdf`;
export const studentIdCardImageUrl = (id: string) => `/student/profiles/${id}/id-card/image`;
