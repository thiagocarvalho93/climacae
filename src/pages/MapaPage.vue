<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useObservationStore } from "src/stores/observations";
import { STATIONS } from "../constants/constants";
import { IObservationCurrent } from "src/models/observation-current-model";

// Fix for Leaflet default icon path issues in some environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface VariableOption {
  label: string;
  value: string;
  unit: string;
  colorRange: [number, number]; // [min, max] for color interpolation
}

const variables: VariableOption[] = [
  { label: "Temperatura", value: "temp", unit: "°C", colorRange: [15, 35] },
  { label: "Umidade", value: "humidity", unit: "%", colorRange: [30, 90] },
  { label: "Vento", value: "windSpeed", unit: " km/h", colorRange: [0, 50] },
  { label: "Precipitação", value: "precipRate", unit: "mm/h", colorRange: [0, 10] },
  { label: "Pressão", value: "pressure32", unit: " hPa", colorRange: [1000, 1020] },
];

const selectedVariable = ref<VariableOption>(variables[0]);
const store = useObservationStore();
const mapInstance = ref<L.Map | null>(null);
const markersLayer = ref<L.LayerGroup | null>(null);
const loading = ref(false);

const idsEstacoes = computed(() => Object.keys(STATIONS));
const observations = computed(() => store.realTimeObservations);

// Simple color interpolation from blue (cold/low) to red (hot/high)
const getColorForVariable = (value: number, range: [number, number]): string => {
  const [min, max] = range;
  const percent = Math.min(Math.max((value - min) / (max - min), 0), 1);
  
  // HSL: 240 (blue) to 0 (red)
  const hue = (1 - percent) * 240;
  return `hsl(${hue}, 70%, 50%)`;
};

const drawMap = (): L.Map => {
  const map = L.map("map").setView([-22.3768, -41.7848], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  return map;
};

const updateMarkers = () => {
  if (!mapInstance.value) return;
  
  if (markersLayer.value) {
    markersLayer.value.clearLayers();
  } else {
    markersLayer.value = L.layerGroup().addTo(mapInstance.value);
  }

  observations.value.forEach((obs: IObservationCurrent) => {
    if (obs.lat && obs.lon) {
      const metric = obs.metric as any;
      // Handle values that might be in metric object or top level (like humidity)
      const rawValue = metric[selectedVariable.value.value] !== undefined 
        ? metric[selectedVariable.value.value] 
        : (obs as any)[selectedVariable.value.value];
      
      const value = Number(rawValue);
      const color = isNaN(value) ? "#999" : getColorForVariable(value, selectedVariable.value.colorRange);
      const displayValue = isNaN(value) ? "N/A" : `${value}${selectedVariable.value.unit}`;
      
      const stationName = STATIONS[obs.stationID as keyof typeof STATIONS]?.NOME || obs.stationID;

      // Custom HTML marker
      const icon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            background-color: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            white-space: nowrap;
            display: inline-block;
          ">
            ${displayValue}
          </div>
        `,
        iconSize: [40, 24],
        iconAnchor: [20, 12],
      });

      const marker = L.marker([Number(obs.lat), Number(obs.lon)], { icon });
      
      marker.bindPopup(`
        <div class="text-subtitle2">${stationName}</div>
        <div class="text-caption">ID: ${obs.stationID}</div>
        <hr/>
        <div><strong>${selectedVariable.value.label}:</strong> ${displayValue}</div>
        <div><small>Atualizado em: ${obs.obsTimeLocal}</small></div>
      `);
      
      marker.addTo(markersLayer.value!);
    }
  });
};

watch(selectedVariable, () => {
  updateMarkers();
});

onMounted(async () => {
  mapInstance.value = drawMap();
  
  loading.value = true;
  await store.getRealTimeObservations(idsEstacoes.value);
  loading.value = false;
  
  updateMarkers();
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Mapa de Estações</div>
            <q-space />
            <q-select
              v-model="selectedVariable"
              :options="variables"
              label="Variável"
              outlined
              dense
              style="min-width: 200px"
            />
          </q-card-section>

          <q-card-section>
            <div id="map" style="height: 600px; border-radius: 8px;"></div>
            <q-inner-loading :showing="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
.custom-map-marker {
  background: none;
  border: none;
}
</style>
