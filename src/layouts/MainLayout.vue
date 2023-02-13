<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
      <q-toolbar class="bg-light-blue-7 text-white shadow-2">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Climacaé </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="700"
      show-if-above
      class="bg-light-blue-9"
    >
      <q-list padding>
        <EssentialLink
          v-for="link in routes[0].children"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import routes from "src/router/routes";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      routes: routes.filter((route) => !!route.showMenu),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
