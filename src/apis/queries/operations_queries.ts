import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import { approvalsUrl, auditLogsUrl, backupsUrl, importJobsUrl, notificationsUrl, operationsDashboardUrl } from "../endpoints/operations_apis";

export const useOperationsDashboardQuery = () => useQuery<TResponse<any>>(operationsDashboardUrl);
export const useAuditLogsQuery = () => useQuery<TResponse<any[]>>(auditLogsUrl);
export const useApprovalsQuery = () => useQuery<TResponse<any[]>>(approvalsUrl);
export const useImportJobsQuery = () => useQuery<TResponse<any[]>>(importJobsUrl);
export const useNotificationsQuery = () => useQuery<TResponse<any[]>>(notificationsUrl);
export const useBackupsQuery = () => useQuery<TResponse<any[]>>(backupsUrl);
