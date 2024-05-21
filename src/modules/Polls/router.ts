export default [
    {
        path: "/polls",
        name: "polls",


        component: () => import("@/modules/Polls/views/Polls.vue"),
        meta: {
            sidebar: 'Polls',
            layout: "MainLayout",
            permissions: ['admin'],
        },
    },

    {
        path: "/polls-detail/:id",
        name: "polls-detail-id",

        component: () => import("@/modules/Polls/pages/DetailPolls.vue"),
        meta: {
            sidebar: 'Polls',
            layout: "MainLayout",
            permissions: ['admin'],
        }

    },
    {
        path: "/polls-question-add",
        name: "polls-question-add",

        component: () => import("@/modules/Polls/pages/DetailQuestionPoll.vue"),
        meta: {
            sidebar: 'Polls',
            layout: "MainLayout",
            permissions: ['admin'],
        }
    },
    {
        path: "/polls-question/:id",
        name: "polls-question-id",

        component: () => import("@/modules/Polls/pages/DetailQuestionPoll.vue"),
        meta: {
            sidebar: 'Polls',
            layout: "MainLayout",
            permissions: ['admin'],
        }
    },

];
