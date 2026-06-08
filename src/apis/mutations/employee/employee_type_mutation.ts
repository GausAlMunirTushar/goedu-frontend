import { useForm } from "@/hooks/useForm";
import { EmployeeType } from "@/apis/types/hrm/employee_type";
import {
    createEmployeeType,
    updateEmployeeTypeById,
    deleteEmployeeTypeById,
} from "@/apis/endpoints/employee/employee_type_apis";

export type EmployeeTypeFormType = Omit<EmployeeType, "id" | "created_at" | "updated_at">;

export const useCreateEmployeeType = (data: EmployeeTypeFormType) =>
    useForm<EmployeeTypeFormType>(createEmployeeType, data, {
        method: "POST",
    });

export const useUpdateEmployeeType = (id: number, data: EmployeeTypeFormType) =>
    useForm<EmployeeTypeFormType>(updateEmployeeTypeById(id), data, {
        method: "PUT",
    });

export const useDeleteEmployeeType = (id: number) =>
    useForm<object>(deleteEmployeeTypeById(id), {}, { method: "DELETE" });
