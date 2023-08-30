export default [
  {
    name: "users",
    icon: "Users Group Rounded",
    path: "/users",
    permissions: ["admin"],
  },

  {
    name: "administration",
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

  {
    name: "stuff",
    icon: "Box",
    path: "/stuff",
    permissions: ["admin"],
  },
];
