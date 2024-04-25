//IMPORTED FILES
import $axios from "@/plugins/axios";
import {
    loginEndpoint,
    logoutEndpoint,
    refreshEndpoint,
    refreshTokenKeyName,
    tokenKeyName,
} from "./jwt.config";
import router from "@/router";


//EXPORTED FUNCTIONS
export function login(...args: any[]) {
    return $axios.post(loginEndpoint, ...args, {
        headers: {no_add_token: true},
    });
}

export async function logout(isClearOnly: boolean = true): Promise<void> {
    if (!isClearOnly) await $axios.post(logoutEndpoint);

    document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    await router.push("/login");
}

export function setAccessToken(value: any): void {
    setCookie(tokenKeyName, value, 2);
}


export function getAccessToken(): string {
    return getCookie(tokenKeyName);
}

export function setRefreshToken(value: any): void {
    setCookie(refreshTokenKeyName, value, 2);
}

export function getRefreshToken(): string {
    return getCookie(refreshTokenKeyName);
}

export function refreshToken() {
    return $axios.post(refreshEndpoint, {
        refresh: getRefreshToken(),
    });
}


function setCookie(name: string, value: object, expirationDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name: string): string {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return "";
}


