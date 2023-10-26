export default [
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/registration/Register.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/fill-data",
        name: "fill-data",
        component: () => import("@/views/registration/FillData.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/sms-confirmation/",
        name: "sms-confirmation",
        component: () => import("@/views/registration/SMSConfirmation.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/face-scan",
        name: "face-scan",
        component: () => import("@/views/registration/FaceScan.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/set-password",
        name: "set-password",
        component: () => import("@/views/registration/SetPassword.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/choose-role",
        name: "chooseRole",
        component: () => import("@/views/registration/ChooseRole.vue"),
        meta: {
            layout: "LoginLayout",
        },
    },
    {
        path: "/register/data-sheet",
        name: "data-sheet",
        component: () => import("@/views/registration/VehicleDataSheet.vue"),
        meta: {
            layout: "LoginLayout",
        },
    },
    {
        path: "/register/registered-successfully",
        name: "registered-successfully",
        component: () => import("@/views/registration/RegisteredSuccessfully.vue"),
        meta: {
            layout: "LoginLayout",
        },
    },
    {
        path: "/register/forgot-password",
        name: "forgot password",
        component: () => import("@/views/registration/ForgotPassword.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/sms-confirmation-for-password",
        name: "sms-confirmation-for-password",
        component: () =>
            import("@/views/registration/SMSConfirmationForPassword.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
    {
        path: "/register/set-new-password",
        name: "set-new-password",
        component: () => import("@/views/registration/SetPassword.vue"),
        meta: {
            layout: "LoginLayout",
            loginNotRequired: true,
        },
    },
];
