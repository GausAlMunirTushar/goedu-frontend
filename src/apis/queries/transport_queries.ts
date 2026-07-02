import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import {
    transportAssignmentsUrl,
    transportDashboardUrl,
    transportDriversUrl,
    transportPassengerReportUrl,
    transportRoutesUrl,
    transportVehiclesUrl,
} from "../endpoints/transport_apis";

const withParams = (url: string, params?: Record<string, string | undefined>) => {
    if (!params) return url;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
    });
    return query.toString() ? `${url}?${query.toString()}` : url;
};

export const useTransportDashboardQuery = () => useQuery<TResponse<any>>(transportDashboardUrl);

export const useTransportVehiclesQuery = () => useQuery<TResponse<any>>(transportVehiclesUrl);

export const useTransportDriversQuery = () => useQuery<TResponse<any>>(transportDriversUrl);

export const useTransportRoutesQuery = () => useQuery<TResponse<any>>(transportRoutesUrl);

export const useTransportAssignmentsQuery = () => useQuery<TResponse<any>>(transportAssignmentsUrl);

export const useTransportPassengerReportQuery = (routeId?: string) =>
    useQuery<TResponse<any>>(withParams(transportPassengerReportUrl, { routeId }));
