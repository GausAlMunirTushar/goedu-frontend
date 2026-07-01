import { useQuery } from '@/hooks/useQuery';
import type { TResponse } from '@/types/configs';
import {
  financeAnalyticsUrl,
  financeCategoriesUrl,
  financeDuesUrl,
  financeInvoicesUrl,
  financePaymentsUrl,
  financeStructuresUrl,
} from '../endpoints/finance_apis';

export const useFinanceAnalyticsQuery = () => {
  return useQuery<TResponse<any>>(financeAnalyticsUrl);
};

export const useFeeCategoriesQuery = () => {
  return useQuery<TResponse<any>>(financeCategoriesUrl);
};

export const useFeeStructuresQuery = (params?: { classId?: string; status?: string }) => {
  let url = financeStructuresUrl;
  if (params) {
    const query = new URLSearchParams();
    if (params.classId) query.append('classId', params.classId);
    if (params.status) query.append('status', params.status);
    if (query.toString()) url += `?${query.toString()}`;
  }
  return useQuery<TResponse<any>>(url);
};

export const useFeeInvoicesQuery = (params?: { status?: string; studentId?: string; classId?: string; sectionId?: string }) => {
  let url = financeInvoicesUrl;
  if (params) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.studentId) query.append('studentId', params.studentId);
    if (params.classId) query.append('classId', params.classId);
    if (params.sectionId) query.append('sectionId', params.sectionId);
    if(query.toString()) {
      url += `?${query.toString()}`;
    }
  }
  return useQuery<TResponse<any>>(url);
};

export const useFeePaymentsQuery = () => {
  return useQuery<TResponse<any>>(financePaymentsUrl);
};

export const useFeeDuesQuery = (params?: { studentId?: string; classId?: string; sectionId?: string }) => {
  let url = financeDuesUrl;
  if (params) {
    const query = new URLSearchParams();
    if (params.studentId) query.append('studentId', params.studentId);
    if (params.classId) query.append('classId', params.classId);
    if (params.sectionId) query.append('sectionId', params.sectionId);
    if (query.toString()) url += `?${query.toString()}`;
  }
  return useQuery<TResponse<any>>(url);
};
