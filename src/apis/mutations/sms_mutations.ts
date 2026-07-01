import { AxiosAPI } from "@/apis/configs";
import {
    saasSmsAdjustmentsUrl,
    saasSmsPurchaseMarkPaidUrl,
    saasSmsPurchasesUrl,
    smsPreviewUrl,
    smsSendUrl,
    smsTemplateDetailUrl,
    smsTemplatesUrl,
} from "@/apis/endpoints/sms_apis";
import type { SmsSendPayload, SmsTemplate } from "@/apis/types/sms_type";

export const previewSms = (payload: SmsSendPayload) => AxiosAPI.post(smsPreviewUrl, payload);
export const sendSms = (payload: SmsSendPayload) => AxiosAPI.post(smsSendUrl, payload);

export const createSmsTemplate = (payload: Omit<SmsTemplate, "id">) =>
    AxiosAPI.post(smsTemplatesUrl, payload);
export const updateSmsTemplate = (id: string, payload: Partial<SmsTemplate>) =>
    AxiosAPI.put(smsTemplateDetailUrl(id), payload);
export const deleteSmsTemplate = (id: string) => AxiosAPI.delete(smsTemplateDetailUrl(id));

export const createSaasSmsPurchase = (payload: {
    institutionId: string;
    credits: number;
    unitPrice: number;
    paymentMethod?: string;
    note?: string;
}) => AxiosAPI.post(saasSmsPurchasesUrl, payload);

export const markSaasSmsPurchasePaid = (
    id: string,
    payload?: { paymentMethod?: string; note?: string },
) => AxiosAPI.post(saasSmsPurchaseMarkPaidUrl(id), payload || {});

export const adjustSaasSmsBalance = (payload: {
    institutionId: string;
    credits: number;
    note: string;
}) => AxiosAPI.post(saasSmsAdjustmentsUrl, payload);
