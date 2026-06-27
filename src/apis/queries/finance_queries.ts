import { useQuery } from '@/hooks/useQuery';
import type { TResponse } from '@/types/configs';
import {
  financeAnalyticsUrl,
  financeCategoriesUrl,
  financeInvoicesUrl,
  financePaymentsUrl,
} from '../endpoints/finance_apis';

export const useFinanceAnalyticsQuery = () => {
  return useQuery<TResponse<any>>(financeAnalyticsUrl);
};

export const useFeeCategoriesQuery = () => {
  return useQuery<TResponse<any>>(financeCategoriesUrl);
};

export const useFeeInvoicesQuery = (params?: { status?: string; studentId?: string }) => {
  let url = financeInvoicesUrl;
  if (params) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.studentId) query.append('studentId', params.studentId);
    if(query.toString()) {
      url += `?${query.toString()}`;
    }
  }
  return useQuery<TResponse<any>>(url);
};

export const useFeePaymentsQuery = () => {
  return useQuery<TResponse<any>>(financePaymentsUrl);
};
