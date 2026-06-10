import axios from "axios";
import Cookies from "js-cookie";

import { COOKIES_KEYS } from "@/configs/constants";

import type { ApiRequestConfig } from "@/types/configs";

const NEXT_PUBLIC_API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

if (NEXT_PUBLIC_API_BASE_URL === "") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env");
}

export const AxiosAPI = axios.create({
    baseURL: NEXT_PUBLIC_API_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

AxiosAPI.interceptors.request.use((config) => {
    const token = Cookies.get(COOKIES_KEYS.ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach active subdomain context if running in browser
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname.toLowerCase();
        const platformDomains = ["localhost", "epathshala.com"];
        for (const plat of platformDomains) {
            if (hostname.endsWith(`.${plat}`)) {
                const subdomain = hostname.slice(0, -(plat.length + 1));
                const firstSubdomain = subdomain.split(".")[0];
                if (firstSubdomain && firstSubdomain !== "www" && firstSubdomain !== "api") {
                    config.headers["X-Subdomain"] = firstSubdomain;
                    break;
                }
            }
        }
    }

    const activeInstitutionId = Cookies.get("institution_id");
    if (activeInstitutionId) {
        config.headers["X-Institution-ID"] = activeInstitutionId;
    } else {
        const userCookie = Cookies.get(COOKIES_KEYS.USER);
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                if (user?.institutionId) {
                    config.headers["X-Institution-ID"] = user.institutionId;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    const locale = Cookies.get(COOKIES_KEYS.LOCALE) || "en";
    config.headers["Accept-Language"] = locale === "bn" ? "bn" : "en";

    return config;
});

// let fiscalYear = Cookies.get("fiscal_year");
// if (!fiscalYear) {
//     const now = new Date();
//     const year = now.getFullYear();
//     if (now.getMonth() >= 6) {
//         fiscalYear = `${year}-${(year + 1).toString().slice(-2)}`;
//     } else {
//         fiscalYear = `${year - 1}-${year.toString().slice(-2)}`;
//     }
// } else {

//     fiscalYear = fiscalYear.replace(/^FY\s*/i, "").replace(/(\d{4})-(\d{2,4})/, (m, y1, y2) => `${y1}-${y2.slice(-2)}`);
// }

// config.headers["X-Fiscal-Year"] = fiscalYear;

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const redirectToLogin = () => {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = `/login?message=session_expired&next=${encodeURIComponent(
            window.location.pathname,
        )}`;
    }
};

AxiosAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return AxiosAPI(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get(COOKIES_KEYS.REFRESH_TOKEN);

            if (!refreshToken) {
                redirectToLogin();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.data.access_token;
                const expiresIn = response.data.data.expires_in;

                if (!newAccessToken) {
                    throw new Error("No access token returned from refresh");
                }

                // Set new access token cookie
                Cookies.set(COOKIES_KEYS.ACCESS_TOKEN, newAccessToken, {
                    expires: expiresIn / 86400,
                    secure: true,
                    sameSite: "Strict",
                });

                // Update default header for future requests
                AxiosAPI.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return AxiosAPI(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                Cookies.remove(COOKIES_KEYS.ACCESS_TOKEN);
                Cookies.remove(COOKIES_KEYS.REFRESH_TOKEN);
                Cookies.remove(COOKIES_KEYS.EXPIRY_TIME);

                redirectToLogin();

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export const AxiosFetcher = async (args: string | ApiRequestConfig) => {
    if (typeof args === "string") {
        return await AxiosAPI.get(args).then((res) => res.data);
    } else {
        const { data, ...rest } = args;
        if (data && data instanceof FormData) {
            rest.headers = {
                ...rest.headers,
                "Content-Type": "multipart/form-data",
            };
        }
        return await AxiosAPI.request({
            data,
            ...rest,
        }).then((res) => res.data);
    }
};

export const AxiosDeleteFetcher = async (args: string | ApiRequestConfig) => {
    if (typeof args === "string") {
        return await AxiosAPI.delete(args).then((res) => res.data);
    } else {
        const { data, ...rest } = args;
        rest.headers = {
            ...rest.headers,
            method: "DELETE",
        };
        return await AxiosAPI.request({
            data,
            ...rest,
        }).then((res) => res.data);
    }
};
