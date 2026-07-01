export type SmsSourceType = "manual" | "attendance" | "result" | "notice";

export interface SmsWallet {
    id?: string;
    institutionId?: string;
    balance: number;
    totalPurchased: number;
    totalUsed: number;
}

export interface SmsRecipientInput {
    number: string;
    name?: string;
    recipientType?: string;
    recipientId?: string;
}

export interface SmsSendPayload {
    sourceType: SmsSourceType;
    sourceId?: string;
    message: string;
    recipients?: SmsRecipientInput[];
    filters?: Record<string, any>;
}

export interface SmsPreviewRecipient {
    name: string;
    recipientType: string;
    recipientId: string;
    originalNumber: string;
    normalizedNumber: string | null;
    message: string;
    units: number;
    encoding: string;
    length: number;
    status: "valid" | "invalid";
    errorMessage?: string | null;
}

export interface SmsPreview {
    wallet: SmsWallet;
    sourceType: SmsSourceType;
    totalRecipients: number;
    validRecipients: number;
    skippedRecipients: number;
    estimatedCredits: number;
    canSend: boolean;
    recipients: SmsPreviewRecipient[];
}

export interface SmsTemplate {
    id: string;
    name: string;
    sourceType: SmsSourceType;
    body: string;
    isActive: boolean;
}

export interface SmsBatch {
    id: string;
    sourceType: SmsSourceType;
    message: string;
    totalRecipients: number;
    validRecipients: number;
    skippedRecipients: number;
    successCount: number;
    failedCount: number;
    estimatedCredits: number;
    usedCredits: number;
    status: string;
    createdAt: string;
    recipients?: SmsPreviewRecipient[];
}

export interface SmsPurchase {
    id: string;
    institutionId: string;
    credits: number;
    unitPrice: number;
    totalAmount: number;
    status: string;
    paymentMethod?: string;
    note?: string;
    createdAt: string;
    institution?: {
        id: string;
        name: string;
        subdomain: string;
    };
}
