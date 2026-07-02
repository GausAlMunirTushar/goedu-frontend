export const transportDashboardUrl = "/transport/dashboard";

export const transportVehiclesUrl = "/transport/vehicles";
export const transportVehicleDetailUrl = (id: string) => `/transport/vehicles/${id}`;

export const transportDriversUrl = "/transport/drivers";
export const transportDriverDetailUrl = (id: string) => `/transport/drivers/${id}`;

export const transportRoutesUrl = "/transport/routes";
export const transportRouteDetailUrl = (id: string) => `/transport/routes/${id}`;
export const transportRouteStopsUrl = (routeId: string) => `/transport/routes/${routeId}/stops`;
export const transportStopDetailUrl = (id: string) => `/transport/stops/${id}`;

export const transportAssignmentsUrl = "/transport/assignments";
export const transportAssignmentDetailUrl = (id: string) => `/transport/assignments/${id}`;

export const transportPassengerReportUrl = "/transport/reports/passengers";
