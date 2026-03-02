const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    showMenu: true,
    children: [
      {
        path: "/",
        title: "Dashboard",
        icon: "bar_chart",
        name: "Dashboard",
        showMenu: true,
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/estacao",
        title: "Estacao",
        icon: "bar_chart",
        name: "Estacao",
        showMenu: true,
        component: () => import("pages/EstacaoPage.vue"),
      },
      {
        path: "/:catchAll(.*)*",
        showMenu: false,
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    showMenu: false,
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
