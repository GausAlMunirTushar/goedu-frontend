export interface HostelData {
    id?: string;
    name: string;
    code?: string;
    type?: string;
    address?: string;
    wardenName?: string;
    wardenPhone?: string;
    status: string;
    _count?: { rooms?: number; beds?: number; allocations?: number };
}

export interface HostelRoomData {
    id?: string;
    hostelId: string;
    hostel?: HostelData;
    roomNo: string;
    floor?: string;
    capacity: number;
    status: string;
    beds?: HostelBedData[];
    _count?: { allocations?: number };
}

export interface HostelBedData {
    id?: string;
    hostelId: string;
    roomId: string;
    hostel?: HostelData;
    room?: HostelRoomData;
    bedNo: string;
    status: string;
    allocations?: HostelAllocationData[];
}

export interface HostelAllocationData {
    id?: string;
    studentId: string;
    hostelId: string;
    roomId: string;
    bedId: string;
    startDate: string;
    endDate?: string | null;
    status: string;
    remarks?: string;
    student?: any;
    hostel?: HostelData;
    room?: HostelRoomData;
    bed?: HostelBedData;
}

export interface HostelLeaveData {
    id?: string;
    allocationId: string;
    fromDate: string;
    toDate: string;
    reason: string;
    destination?: string;
    guardianPhone?: string;
    status: string;
    allocation?: HostelAllocationData;
    student?: any;
    hostel?: HostelData;
}
