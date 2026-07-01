import {
    saasSmsLogsUrl,
    saasSmsProviderBalanceUrl,
    saasSmsPurchasesUrl,
    saasSmsWalletsUrl,
    smsHistoryUrl,
    smsPurchasesUrl,
    smsTemplatesUrl,
    smsWalletUrl,
} from "@/apis/endpoints/sms_apis";
import type { SmsBatch, SmsPurchase, SmsTemplate, SmsWallet } from "@/apis/types/sms_type";
import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";

export const useSmsWalletQuery = () =>
    useQuery<TResponse<{ wallet: SmsWallet; recentBatches: SmsBatch[]; purchases: SmsPurchase[] }>>(
        smsWalletUrl,
    );
export const useSmsPurchasesQuery = () => useQuery<TResponse<SmsPurchase[]>>(smsPurchasesUrl);
export const useSmsTemplatesQuery = () => useQuery<TResponse<SmsTemplate[]>>(smsTemplatesUrl);
export const useSmsHistoryQuery = () =>
    useQuery<TResponse<{ items: SmsBatch[]; total: number; page: number; pageSize: number }>>(
        smsHistoryUrl,
    );

export const useSaasSmsWalletsQuery = () => useQuery<TResponse<any[]>>(saasSmsWalletsUrl);
export const useSaasSmsPurchasesQuery = () =>
    useQuery<TResponse<SmsPurchase[]>>(saasSmsPurchasesUrl);
export const useSaasSmsLogsQuery = () => useQuery<TResponse<SmsBatch[]>>(saasSmsLogsUrl);
export const useSaasSmsProviderBalanceQuery = () =>
    useQuery<TResponse<{ balance: string; raw: string }>>(saasSmsProviderBalanceUrl);
