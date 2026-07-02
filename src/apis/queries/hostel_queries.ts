import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import {
    hostelAllocationsUrl,
    hostelBedsUrl,
    hostelDashboardUrl,
    hostelLeavesUrl,
    hostelRoomsUrl,
    hostelsUrl,
} from "../endpoints/hostel_apis";

export const useHostelDashboardQuery = () => useQuery<TResponse<any>>(hostelDashboardUrl);

export const useHostelsQuery = () => useQuery<TResponse<any>>(hostelsUrl);

export const useHostelRoomsQuery = () => useQuery<TResponse<any>>(hostelRoomsUrl);

export const useHostelBedsQuery = () => useQuery<TResponse<any>>(hostelBedsUrl);

export const useHostelAllocationsQuery = () => useQuery<TResponse<any>>(hostelAllocationsUrl);

export const useHostelLeavesQuery = () => useQuery<TResponse<any>>(hostelLeavesUrl);
