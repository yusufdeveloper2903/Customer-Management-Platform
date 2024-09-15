//IMPORTED FILES
import router from "@/router";


//EXPORTED FUNCTIONS
export function logout() {
    router.push("/login");
}


export function getAccessToken(val): boolean {
    return !!val.length;
}
