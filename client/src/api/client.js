import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry && !original.url.includes("/auth/refresh")) {
        original._retry = true;
        try {
            if (!refreshPromise) {
                refreshPromise = api.post("/auth/refresh").finally(() => {
                    refreshPromise = null;
                });
            }
            const { data } = await refreshPromise;
            setAccessToken(data.accessToken);
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
        } catch (refreshError) {
            setAccessToken(null);
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});
