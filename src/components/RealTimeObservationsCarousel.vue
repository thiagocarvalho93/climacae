<template>
  <q-card flat class="full-width">
    <q-card-section class="text-h6">
      Agora ({{ ultimaAtualizacao }})
    </q-card-section>
    <q-card-section>
      <q-carousel v-model="slide" transition-duration="600" transition-prev="slide-right" transition-next="slide-left"
        swipeable animated :control-color="darkMode ? 'white' : 'primary'" padding arrows infinite height="265px" autoplay
        class="bg-transparent" @mouseenter="autoplay = false" @mouseleave="autoplay = true">
        <q-carousel-slide v-for="dados in realTimeObservations" :key="dados.stationID"
          :name="estacoes[dados.stationID].NOME" class="column no-wrap flex-center">
          <div class="q-mt-md text-center text-h6">
            {{ estacoes[dados.stationID].NOME }}
          </div>
          <div class="justify-start">
            <div class="q-mt-md text-h6 text-start">
              <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="ion-thermometer" />
              {{ dados.metric.temp }}°C
            </div>
            <div class="q-mt-md text-h6 text-start">
              <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="ion-rainy" />
              {{ dados.metric.precipRate }}mm/h
            </div>
          </div>
          <div class="q-mt-md text-h6 text-start">
            <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="water_drop" />
            {{ dados.humidity }}%
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>
    <q-inner-loading :showing="carregandoTempoReal" label="Aguarde..." label-class="text-teal"
      label-style="font-size: 1.1em" />
  </q-card>
</template>

<script>
import { STATIONS } from 'src/constants/constants';

export default {
  props: {
    realTimeObservations: Array,
    estacoes: Object,
    ultimaAtualizacao: String,
    darkMode: Boolean,
    carregandoTempoReal: Boolean,
  },
  data() {
    return {
      slide: STATIONS[Object.keys(STATIONS)[0]].NOME,
    }
  }
};
</script>
