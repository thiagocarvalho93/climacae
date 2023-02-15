<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="700"
      show-if-above
      class="bg-blue-9"
      :mini="true"
    >
      <q-item
        v-for="link in routes[0].children.filter((route) => !!route.showMenu)"
        :key="link.title"
        class="fade item"
        clickable
        @click="$router.push(link.path)"
      >
        <EssentialLink v-bind="link" />
      </q-item>
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

      clickItem() {
        this.$router.push(path);
      },
    };
  },
});
</script>
<style scoped>
</style>
