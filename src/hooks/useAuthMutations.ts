import {
    useResetPasswordMutation as useBaseResetPasswordMutation,
    type ResetPasswordFormType,
} from "@/apis/mutations/auth_mutations";
import { InitialOptions } from "@/hooks/useForm";
import { useEffect, useRef } from "react";

export const useResetPasswordMutationWithInitialValues = (
    initialValues?: Partial<{
        uid: string | InitialOptions;
        token: string | InitialOptions;
    }>,
) => {
    const baseMutation = useBaseResetPasswordMutation();
    const hasSetInitialValues = useRef(false);

    // If initial values are provided, set them once
    useEffect(() => {
        if (initialValues && !hasSetInitialValues.current) {
            hasSetInitialValues.current = true;

            Object.entries(initialValues).forEach(([key, value]) => {
                if (value && typeof value === "object" && "value" in value) {
                    baseMutation
                        .register(key as keyof ResetPasswordFormType)
                        .onChange({ target: { value: (value as InitialOptions).value } } as any);
                } else if (typeof value === "string") {
                    baseMutation
                        .register(key as keyof ResetPasswordFormType)
                        .onChange({ target: { value } } as any);
                }
            });
        }
    }, []);

    return baseMutation;
};
