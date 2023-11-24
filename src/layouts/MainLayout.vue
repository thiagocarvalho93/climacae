<template>
  <q-layout view="hHh lpR fff">
    <q-header :bordered="isDarkMode" reveal :class="`${isDarkMode ? 'bg-dark' : 'bg-white shadow-2'}`">
      <q-toolbar>
        <q-toolbar-title class="fade">
          <q-avatar>
            <q-img src="../assets/logo-192x192.png" spinner-color="white" style="height: 25px" fit="scale-down" />
          </q-avatar>
        </q-toolbar-title>
        <q-toggle v-model="isDarkMode" color="black" keep-color @update:model-value="toggleDarkMode(isDarkMode)"
          icon="nightlight" unchecked-icon="light_mode" />
      </q-toolbar>

      <q-tabs class="text-primary" v-model="tab">
        <q-route-tab to="/" label="Geral" />
        <q-route-tab to="/estacao" label="Estação" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered :class="`text-white ${isDarkMode ? 'bg-dark' : 'bg-white'}`">
      <q-toolbar class="row justify-center">
        <div class="col-3 col-md-1 fade">
          <q-toolbar-title>
            <a target="_blank" href="https://www.linkedin.com/in/thiago-paes-de-carvalho/">
              <q-btn round unelevated :text-color="isDarkMode ? 'white' : 'dark'" icon="ion-logo-linkedin" />
            </a>
            <a target="_blank" href="https://github.com/thiagocarvalho93/climacae">
              <q-btn round unelevated :text-color="isDarkMode ? 'white' : 'dark'" icon="ion-logo-github" />
            </a>
          </q-toolbar-title>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<style>
a {
  text-decoration: none;
  color: white;
}
</style>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      isDarkMode: ref(false),
    };
  },

  data() {
    return {
      tab: "",
    };
  },

  mounted() { },

  methods: {
    toggleDarkMode(val) {
      this.$q.dark.set(val);
    },
  },
};
</script>
<style lang="sass">
.navbar
  background-image: linear-gradient(180deg,$blue-9, $blue-10)
</style>
