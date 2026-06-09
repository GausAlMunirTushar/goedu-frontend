export interface StudentAttendanceRecord {
    id: number;
    student_id: number;
    roll: string;
    name: string;
    status: 'Present' | 'Absent' | 'Leave' | 'Late';
    date: string;
    remarks?: string;
}

export interface TeacherAttendanceRecord {
    id: number;
    teacher_id: number;
    code: string;
    name: string;
    designation: string;
    in_time?: string;
    out_time?: string;
    status: 'Present' | 'Absent' | 'Leave';
    date: string;
}

export interface AttendanceSummary {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: string;
}
