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
        title: "Station",
        icon: "bar_chart",
        name: "Station",
        showMenu: true,
        component: () => import("pages/StationPage.vue"),
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
