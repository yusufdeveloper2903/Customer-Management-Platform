export default [
  {
    name: "dashboard",
    icon: "Home Smile",
    path: "/dashboard",
    permissions: ["admin"],
  },

  {
    name: "Users",
    icon: "Users Group Rounded",
    path: "/users",
    permissions: ["admin"],
  },

  {
    name: "nav.directory",
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
    name: "Administration",
    icon: "Settings",
    permissions: ["admin"],
    child: [
      {
        name: "backups",
        path: "/reference/backup",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "journaling",
        path: "/reference/logging",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "backup&archiving",
        path: "/reference/data-archive",
        icon: "File",
        permissions: ["admin"],
      },
      {
        name: "system",
        path: "/reference/system-info",
        icon: "File",
        permissions: ["admin"],
      },
    ],
  },
];
