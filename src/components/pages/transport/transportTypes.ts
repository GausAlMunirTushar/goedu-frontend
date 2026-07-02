export interface TransportVehicleData {
    id?: string;
    name: string;
    registrationNo: string;
    type?: string;
    capacity: number;
    status: string;
}

export interface TransportDriverData {
    id?: string;
    name: string;
    phone: string;
    licenseNo?: string;
    address?: string;
    status: string;
}

export interface TransportStopData {
    id?: string;
    name: string;
    pickupTime?: string;
    dropTime?: string;
    monthlyFee?: number;
    sortOrder?: number;
}

export interface TransportRouteData {
    id?: string;
    name: string;
    code?: string;
    vehicleId?: string;
    driverId?: string;
    status: string;
    vehicle?: TransportVehicleData;
    driver?: TransportDriverData;
    stops?: TransportStopData[];
    _count?: { assignments?: number };
}

export interface TransportAssignmentData {
    id?: string;
    studentId: string;
    routeId: string;
    stopId?: string;
    pickupPoint?: string;
    startDate: string;
    endDate?: string | null;
    status: string;
    student?: any;
    route?: TransportRouteData;
    stop?: TransportStopData;
}
