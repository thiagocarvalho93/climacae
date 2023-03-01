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
