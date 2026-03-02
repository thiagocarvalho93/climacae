<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="text-h6">
      Agora ({{ ultimaAtualizacao }})
    </q-card-section>
    <q-card-section>
      <q-carousel
        v-model="slide"
        transition-duration="600"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        :control-color="darkMode ? 'white' : 'primary'"
        padding
        arrows
        infinite
        height="265px"
        v-model:autoplay="autoplay"
        class="bg-transparent"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide
          v-for="dados in realTimeObservations"
          :key="dados.stationID"
          :name="estacoes[dados.stationID]?.NOME || ''"
          class="column no-wrap flex-center"
        >
          <div class="q-pa-md p-2">
            <div class="q-mt-md text-h6 text-weight-bold">
              {{ estacoes[dados.stationID]?.NOME }}
            </div>

            <div class="justify-start">
              <div class="q-mt-md text-body1">
                <q-icon
                  class="icon"
                  :color="darkMode ? 'white' : 'primary'"
                  size="md"
                  name="ion-thermometer"
                />
                {{ dados.metric.temp }}°C
              </div>
              <div class="q-mt-md text-body1">
                <q-icon
                  class="icon"
                  :color="darkMode ? 'white' : 'primary'"
                  size="md"
                  name="ion-rainy"
                />
                {{ dados.metric.precipRate }}mm/h
              </div>
            </div>
            <div class="q-mt-md text-body1">
              <q-icon
                class="icon"
                :color="darkMode ? 'white' : 'primary'"
                size="md"
                name="water_drop"
              />
              {{ dados.humidity }}%
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>
    <q-inner-loading
      :showing="carregando"
      label="Aguarde..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, PropType } from "vue";
import { STATIONS, Stations } from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "RealTimeObservationsCarousel",
  props: {
    estacoes: {
      type: Object as PropType<Stations>,
      required: true
    },
    darkMode: Boolean,
  },

  setup() {
    const store = useObservationStore();
    const slide = ref(STATIONS[Object.keys(STATIONS)[0]].NOME);
    const carregando = ref(false);
    const autoplay = ref<boolean | number>(true);
    const ultimaAtualizacao = ref(new Date().toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    }));

    const realTimeObservations = computed(() => store.realTimeObservations);
    const idsEstacoes = computed(() => Object.keys(STATIONS));

    let intervalId: any = null;

    const fetchRealTime = async () => {
      carregando.value = true;
      try {
        await store.getRealTimeObservations(idsEstacoes.value);
        ultimaAtualizacao.value = new Date().toLocaleTimeString(
          navigator.language,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      } finally {
        carregando.value = false;
      }
    };

    onMounted(async () => {
      await fetchRealTime();
      intervalId = setInterval(fetchRealTime, 30000);
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      slide,
      carregando,
      autoplay,
      ultimaAtualizacao,
      realTimeObservations,
      fetchRealTime
    };
  },
});
</script>
