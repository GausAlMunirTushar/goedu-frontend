import { useState } from "react";

export const useLoginMutation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<{username?: string; password?: string}>({});

    const submit = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        return {
            data: {
                access_token: "mock_token_123",
                refresh_token: "mock_refresh_token_123",
                user: { first_name: "GoEdu", last_name: "Admin" },
                expires_in: 86400
            }
        };
    };

    const register = (name: string) => ({
        name,
        value: data[name] || (name === "remember_me" ? false : ""),
        onChange: (e: any) => {
            const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            setData(prev => ({ ...prev, [name]: val }));
        }
    });

    return { data, errors, isLoading, submit, register };
};
