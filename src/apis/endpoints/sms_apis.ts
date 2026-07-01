export const smsWalletUrl = "/sms/wallet";
export const smsPurchasesUrl = "/sms/purchases";
export const smsPreviewUrl = "/sms/preview";
export const smsSendUrl = "/sms/send";
export const smsHistoryUrl = "/sms/history";
export const smsTemplatesUrl = "/sms/templates";
export const smsTemplateDetailUrl = (id: string) => `/sms/templates/${id}`;

export const saasSmsWalletsUrl = "/saas/sms/wallets";
export const saasSmsPurchasesUrl = "/saas/sms/purchases";
export const saasSmsPurchaseMarkPaidUrl = (id: string) => `/saas/sms/purchases/${id}/mark-paid`;
export const saasSmsAdjustmentsUrl = "/saas/sms/adjustments";
export const saasSmsProviderBalanceUrl = "/saas/sms/provider-balance";
export const saasSmsLogsUrl = "/saas/sms/logs";
