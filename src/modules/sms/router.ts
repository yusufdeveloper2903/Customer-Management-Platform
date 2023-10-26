export default [
  {
    path: "/sms-template",
    name: "sms-template",
    component: () => import("@/modules/sms/views/index.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
  {
    path: "/add-sms",
    name: "add-sms",
    component: () => import("@/modules/sms/components/smsTemplate/AddSms.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
  {
    path: "/push-notification",
    name: "push-notification",
    component: () => import("@/modules/sms/components/push/AddPushNotifications.vue"),
    meta: {
      layout: "MainLayout",
      permissions: ["admin"],
    },
  },
];
