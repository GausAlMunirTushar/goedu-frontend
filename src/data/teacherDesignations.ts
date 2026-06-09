// src/data/teacherDesignations.ts

export interface TeacherDesignationData {
  id?: string;
  title: string;
  description?: string;
  status: "Active" | "Inactive";
}

export const teacherDesignations: TeacherDesignationData[] = [
  { id: "1", title: "Professor", description: "Senior academic staff", status: "Active" },
  { id: "2", title: "Assistant Professor", description: "Junior academic staff", status: "Active" },
  { id: "3", title: "Lecturer", description: "Teaching staff", status: "Inactive" },
];
