//IMPORTED FILES
import {
    getAccessToken,
    logout,
    setAccessToken,
    refreshToken,
} from "@/auth/jwtService";
import router from "@/router";
import axios from "axios";
import {refreshEndpoint} from "@/auth/jwt.config";
import {toast} from "vue3-toastify";
import i18n from "./i18n";

//DECLARED VARIABLES
const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    timeout: 20000,

    headers: {Accept: "application/json"},
});
let isAlreadyFetchingAccessToken = false;
let subscribers = [];
const onAccessTokenFetched = (accessToken: any) => {
    subscribers = subscribers.filter((callback:any) => callback(accessToken));
};
const addSubscriber = (callback: any) => {
    subscribers.push(callback);
};

const sendErrorLog = (error: any) => {
    axios({
        url: `${
            import.meta.env.VITE_ERROR_LOG_URL
        }/project/statistic_card_history/create_error_log/`,
        method: "POST",
        data: {
            method: error.response.config.method,
            base_url: error.response.config.baseURL + error.response.config.url,
            message: error.response.statusText,
            status: error.response.status,
            params: error.response.config.params,
            data: error.response.data,
            headers: error.response.headers,
            project_name: "Havas",
            project_id: 81,
            user_id: 1,
        },
        timeout: 20000,
    });
};


//SEND TOKEN
axiosIns.interceptors.request.use(
    (config) => {
        let token = getAccessToken();
        if (token && config.headers && !config.headers.no_add_token) {
            config.headers.Authorization = "Bearer " + token;
        }
        if (config.headers && config.headers.no_add_token) {
            delete config.headers.no_add_token;
        }
        if (config.headers) {
            config.headers.lang = i18n.global.locale.value;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//404 OR 401 PAGES USE THIS RESPONSE
axiosIns.interceptors.response.use(
    (response) => response,
    async (error) => {
        const {config: originalRequest} = error;
        if (
            error.response.status === 401 &&
            router.currentRoute.value.meta.layout !== "LoginLayout"
        ) {
            sendErrorLog(error);
            if (!isAlreadyFetchingAccessToken) {
                isAlreadyFetchingAccessToken = true;
                const {data} = await refreshToken();
                isAlreadyFetchingAccessToken = false;
                onAccessTokenFetched(data.access);
                setAccessToken(data.access);
                router.go(0)
            } else if (
                isAlreadyFetchingAccessToken &&
                error.config.url === refreshEndpoint
            ) {
                await logout();
            }
            const retryOriginalRequest: any = new Promise((resolve) => {
                addSubscriber((access: any) => {
                    let token = getAccessToken();
                    if (access) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(axiosIns(originalRequest));
                });
            });
            return retryOriginalRequest;
        } else if (error.response.status === 422) {
            toast.error(t('error'));
        } else if (error.response.status === 500) {
            toast.error(t("Error from server!"));
        }

        return Promise.reject(error);
    }
);

export default axiosIns;
