<template>
  <q-layout view="hHh lpR fff">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="fade">
          <q-avatar>
          </q-avatar>
          CliMacaé
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar class="row justify-center">
        <div class="col-3 col-md-1 fade">
          <q-toolbar-title>
            <a target="_blank" href="https://www.linkedin.com/in/thiago-paes-de-carvalho/">
              <q-btn unelevated round icon="ion-logo-linkedin" />
            </a>
            <a target="_blank" href="https://github.com/thiagocarvalho93">
              <q-btn unelevated round icon="ion-logo-github" />
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
