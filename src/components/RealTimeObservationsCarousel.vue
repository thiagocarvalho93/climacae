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
        autoplay
        class="bg-transparent"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide
          v-for="dados in realTimeObservations"
          :key="dados.stationID"
          :name="estacoes[dados.stationID].NOME"
          class="column no-wrap flex-center"
        >
          <div class="q-pa-md p-2">
            <div class="q-mt-md text-h6 text-weight-bold">
              {{ estacoes[dados.stationID].NOME }}
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

<script>
import { STATIONS } from "src/constants/constants";
import { mapActions, mapState } from "pinia";
import { useObservationStore } from "src/stores/observations";

export default {
  props: {
    estacoes: Object,
    darkMode: Boolean,
  },

  data() {
    return {
      slide: STATIONS[Object.keys(STATIONS)[0]].NOME,
      carregando: false,
      ultimaAtualizacao: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  },

  computed: {
    idsEstacoes() {
      return Object.keys(STATIONS);
    },
    ...mapState(useObservationStore, ["realTimeObservations"]),
  },

  async created() {
    await this.getRealTimeObservations(this.idsEstacoes);
    this.atualizarDadosAtuais();
  },

  beforeUnmount() {
    clearInterval(this.atualizarDadosAtuais);
  },

  methods: {
    ...mapActions(useObservationStore, ["getRealTimeObservations"]),

    atualizarDadosAtuais() {
      setInterval(async () => {
        this.carregando = true;

        await this.getRealTimeObservations(this.idsEstacoes);

        this.ultimaAtualizacao = new Date().toLocaleTimeString(
          navigator.language,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        this.carregando = false;
      }, 30000);
    },
  },
};
</script>
