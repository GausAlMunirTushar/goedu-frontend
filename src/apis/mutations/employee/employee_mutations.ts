import { useForm } from "@/hooks/useForm";
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    downloadPayslip,
    createSalaryCertificateRequest,
    acceptSalaryCertificateRequest,
    rejectSalaryCertificateRequest,
    deliverSalaryCertificateRequest,
    receiveSalaryCertificateRequest,
    downloadSalaryCertificateRequest,
} from "@/apis/endpoints/employee/employee_apis";
import type {
    EmployeeFormType,
    PayslipDownloadParams,
    SalaryCertificateRequestForm,
} from "@/apis/types/employee_type";

export const useCreateEmployeeMutation = (data: EmployeeFormType) =>
    useForm<EmployeeFormType>(createEmployee, data, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const useUpdateEmployeeMutation = (id: number, data: EmployeeFormType) =>
    useForm<EmployeeFormType>(updateEmployee(id), data, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const useDeleteEmployeeMutation = (id: number) =>
    useForm<object>(
        deleteEmployee(id),
        {},
        {
            method: "DELETE",
        },
    );

// Payslip download mutation
export const useDownloadPayslip = () =>
    useForm<PayslipDownloadParams>(downloadPayslip, {} as PayslipDownloadParams, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

// Salary Certificate Request mutations
export const useCreateSalaryCertificateRequestMutation = (data: SalaryCertificateRequestForm) =>
    useForm<SalaryCertificateRequestForm>(createSalaryCertificateRequest, data, {
        method: "POST",
    });

export const useAcceptSalaryCertificateRequestMutation = (id: number) =>
    useForm(
        acceptSalaryCertificateRequest(id),
        {},
        {
            method: "POST",
        },
    );

export const useRejectSalaryCertificateRequestMutation = (id: number) =>
    useForm(
        rejectSalaryCertificateRequest(id),
        {},
        {
            method: "POST",
        },
    );

export const useDeliverSalaryCertificateRequestMutation = (id: number) =>
    useForm(
        deliverSalaryCertificateRequest(id),
        {},
        {
            method: "POST",
        },
    );

export const useReceiveSalaryCertificateRequestMutation = (id: number) =>
    useForm(
        receiveSalaryCertificateRequest(id),
        {},
        {
            method: "POST",
        },
    );

export const useDownloadSalaryCertificateRequestMutation = (id: number) =>
    useForm(
        downloadSalaryCertificateRequest(id),
        {},
        {
            method: "GET",
            responseType: "blob",
        },
    );
