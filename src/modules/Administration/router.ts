export default [
  {
    path: "/reference/backup",
    name: "Backup",
    component: () => import("@/modules/Administration/views/backup/index.vue"),
    meta: {
      layout: 'MainLayout',
      permissions: ['admin'],
    },
  },
  {
    path: "/reference/logging",
    name: "Logging",
    component: () => import("@/modules/Administration/views/logging/index.vue"),
    meta: {
      layout: 'MainLayout',
      permissions: ['admin'],
    },
  },
  {
    path: "/reference/data-archive",
    name: "DataArchive",
    component: () => import("@/modules/Administration/views/data_archive/index.vue"),
    meta: {
      layout: 'MainLayout',
      permissions: ['admin'],
    },
  },
  {
    path: "/reference/system-info",
    name: "SystemInfo",
    component: () => import("@/modules/Administration/views/system_info/index.vue"),
    meta: {
      layout: 'MainLayout',
      permissions: ['admin'],
    },
  },
]