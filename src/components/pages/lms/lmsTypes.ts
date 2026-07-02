export interface LessonPlanData {
    id?: string;
    title: string;
    classId: string;
    sectionId?: string;
    subjectId: string;
    teacherId?: string;
    planDate: string;
    objectives?: string;
    activities?: string;
    materials?: string;
    homeworkNote?: string;
    status: string;
    class?: any;
    section?: any;
    subject?: any;
    teacher?: any;
}

export interface HomeworkData {
    id?: string;
    title: string;
    description: string;
    classId: string;
    sectionId?: string;
    subjectId: string;
    teacherId?: string;
    dueDate: string;
    attachmentUrl?: string;
    status: string;
    class?: any;
    section?: any;
    subject?: any;
    teacher?: any;
    _count?: { submissions?: number };
}

export interface HomeworkSubmissionData {
    id?: string;
    homeworkId: string;
    studentId?: string;
    content?: string;
    attachmentUrl?: string;
    marks?: number;
    grade?: string;
    feedback?: string;
    status?: string;
    homework?: HomeworkData;
    student?: any;
}

export interface ClassResourceData {
    id?: string;
    title: string;
    description?: string;
    type: string;
    fileUrl?: string;
    classId: string;
    sectionId?: string;
    subjectId?: string;
    teacherId?: string;
    status: string;
    class?: any;
    section?: any;
    subject?: any;
    teacher?: any;
}
