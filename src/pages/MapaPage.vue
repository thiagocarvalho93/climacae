<script setup lang="ts">
import { computed, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useObservationStore } from "src/stores/observations";
import { STATIONS } from "../constants/constants";

const store = useObservationStore();

const idsEstacoes = computed(() => Object.keys(STATIONS));
const observations = computed(() => store.realTimeObservations);

const drawMap = (): L.Map => {
  const map = L.map("map").setView([-22.3768, -41.7848], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  return map;
};

const addStationMarkers = (map: L.Map) => {
  observations.value.forEach((x) => {
    if (x.lat && x.lon) {
      L.marker([Number(x.lat), Number(x.lon)]).addTo(map);
    }
  });
};

onMounted(async () => {
  const map = drawMap();

  await store.getRealTimeObservations(idsEstacoes.value);

  addStationMarkers(map);
});
</script>

<template>
  <q-page>
    <h4>Em construção</h4>
    <div id="map" style="height: 500px"></div>
  </q-page>
</template>
