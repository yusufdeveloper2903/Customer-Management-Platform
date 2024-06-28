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
            // config.headers.lang = i18n.global.locale.value;
            config.headers['Accept-Language'] = i18n.global.locale.value;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// axiosIns.interceptors.request.use(
//     (config) => {
//       let token = getAccessToken();
//       if (token && config.headers) {
//         // config.headers.Authorization = "Bearer " + token;
//       }
//       if (config.headers) {
//         config.headers['Content-Language'] = i18n.global.locale.value;
//     }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );


  

//404 OR 401 PAGES USE THIS RESPONSE
axiosIns.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (
            error.response.status === 401 &&
            router.currentRoute.value.meta.layout !== "LoginLayout"
        ) {
            if (!isAlreadyFetchingAccessToken) {
                isAlreadyFetchingAccessToken = true;
                const {data} = await refreshToken();
                isAlreadyFetchingAccessToken = false;
                setAccessToken(data.access);
                router.go(0)
            } else if (
                isAlreadyFetchingAccessToken &&
                error.config.url === refreshEndpoint
            ) {
                await logout();
            }

        } else if (error.response.status === 422) {
            toast.error(i18n.global.locale.value == 'uz' ? 'Xatolik' : 'Ошибка');
        } else if (error.response.status === 500) {
            toast.error(i18n.global.locale.value == 'uz' ? 'Serverdan xato!' : 'Ошибка с сервера!');
        }

        return Promise.reject(error);
    }
);

export default axiosIns;
