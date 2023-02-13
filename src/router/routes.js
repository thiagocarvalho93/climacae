const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    showMenu: true,
    children: [
      {
        path: "/",
        title: "Home",
        icon: "bar_chart",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "temperatura",
        title: "Temperatura",
        icon: "thermostat",
        component: () => import("pages/TemperaturaPage.vue"),
      },
      {
        path: "precipitacao",
        title: "Precipitação",
        icon: "water_drop",
        component: () => import("pages/PrecipitacaoPage.vue"),
      },
      {
        path: "vento",
        title: "Vento",
        icon: "wind_power",
        component: () => import("pages/VentoPage.vue"),
      },
      {
        path: "pressao",
        title: "Pressão",
        icon: "compress",
        component: () => import("pages/PressaoPage.vue"),
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
