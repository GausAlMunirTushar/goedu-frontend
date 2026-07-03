export const fmt = (value?: string) => value ? new Date(value).toLocaleString() : "-";

export type ApprovalData = { id?: string; title: string; module: string; entityType?: string; entityId?: string; status?: string; decisionNote?: string; requestedAt?: string; };
export type ImportJobData = { id?: string; module: string; fileName?: string; status?: string; totalRows?: number; processedRows?: number; successRows?: number; failedRows?: number; errorSummary?: string; createdAt?: string; };
export type NotificationData = { id?: string; title: string; body: string; type?: string; status?: string; actionUrl?: string; createdAt?: string; };
export type BackupData = { id?: string; status?: string; format?: string; scope?: string; fileUrl?: string; expiresAt?: string; createdAt?: string; };
