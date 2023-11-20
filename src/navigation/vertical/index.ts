export default [
  {
    name: "Панель приборов",
    icon: "Home Smile",
    path: "/dashboard",
    permissions: ["admin"],
  },

  {
    name: "users",
    icon: "Users Group Rounded",
    path: "/users",
    permissions: ["admin"],
  },

  {
    name: "Справочник",
    icon: "Book Bookmark",
    path: "/knowledgeBase",
    permissions: ["admin"],
  },

  {
    name: "nav.staffs",
    icon: "Box",
    path: "/staff",
    permissions: ["admin"],
  },

  // {
  //   name: "news",
  //   icon: "Fire",
  //   path: "/news",
  //   permissions: ["admin"],
  // },

  {
    name: "Notifications",
    icon: "Chat Line",
    path: "/sms-template",
    permissions: ["admin"],
  },

  {
    name: "Администрация",
    icon: "Settings",
    permissions: ["admin"],
    child: [
      {
        name: "global.backups",
        path: "/reference/backup",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "global.journaling",
        path: "/reference/logging",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "global.backup&archiving",
        path: "/reference/data-archive",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "global.system",
        path: "/reference/system-info",
        icon: "File",
        permissions: ["admin"],
      },
    ],
  },
];
