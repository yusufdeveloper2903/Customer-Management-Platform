export default [
    {
        name: "dashboard",
        icon: "Devices",
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
        name: "Stories",
        icon: "Clipboard List",
        path: "/stories",
        permissions: ["admin"],
    },
    {
        name: "Polls",
        icon: "Checklist",
        path: "/polls",
        permissions: ["admin"],
    },
    {
        name: "Transactions",
        path: "/transactions",
        icon: "Sort Vertical",
        permissions: ["admin"],
    },
    {
        name: "Notifications",
        icon: "Bell",
        path: "/sms-template",
        permissions: ["admin"],
    },
    {
        name: "productsCategory",
        icon: 'Widget 4',
        path: '/products',
        permissions: ['admin']
    },

    {
        name: "Promotions",
        path: "/promotion",
        icon: "Sale",
        permissions: ["admin"],
    },


    {
        name: "nav.directory",
        icon: "Folder With Files",
        path: "/knowledgeBase",
        permissions: ["admin"],
    },
    {
        name: "nav.staffs",
        icon: "User hands",
        path: "/staff",
        permissions: ["admin"],
    },

    {
        name: "Recipes",
        icon: "Chef Hat Minimalistic",
        path: "/recipes",
        permissions: ["admin"],
    },


    {
        name: "Administration",
        icon: "Shield check",
        permissions: ["admin"],
        child: [
            {
                name: "backups",
                path: "/reference/backup",
                icon: "Notes",
                permissions: ["admin"],
            },
            {
                name: "journaling",
                path: "/reference/logging",
                icon: "Book Bookmark Minimalistic",
                permissions: ["admin"],
            },
            {
                name: "backup&archiving",
                path: "/reference/data-archive",
                icon: "Server path",
                permissions: ["admin"],
            },
            {
                name: "info_about_system",
                path: "/reference/system-info",
                icon: "CPU",
                permissions: ["admin"],
            },
        ],
    },


];
