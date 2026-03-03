<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="text-h6"> Máximas e mínimas </q-card-section>
    <q-card-section>
      <apexchart
        type="bar"
        height="250"
        :options="chartTemperaturaOptions"
        :series="chartSeries"
        ref="graficoColunaTemperatura"
      ></apexchart>
    </q-card-section>
    <q-inner-loading
      :showing="loading"
      label="Aguarde..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { CHART_TEMPERATURA_OPTIONS, CORES } from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "GraficoTemperaturaGeral",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useObservationStore();
    const graficoColunaTemperatura = ref<any>(null);
    const chartSeries = ref<any[]>([]);

    const chartTemperaturaOptions = computed(() => CHART_TEMPERATURA_OPTIONS);
    const stationsMetrics = computed(() => store.stationsMetrics);

    const update = () => {
      const dadosFiltrados = stationsMetrics.value.filter(
        (x) => x.maxima !== -Infinity && x.minima !== Infinity
      );

      graficoColunaTemperatura.value?.updateOptions({
        series: [
          {
            name: "Máxima",
            color: CORES.VERMELHO,
            data: dadosFiltrados.map((x) => x.maxima),
          },
          {
            name: "Mínima",
            color: CORES.AZUL,
            data: dadosFiltrados.map((x) => x.minima),
          },
        ],
        xaxis: {
          categories: dadosFiltrados.map((x) =>
            x.id.length > 12 ? `${x.id.substring(0, 12)}...` : x.id
          ),
        },
        yaxis: {
          tickAmount: 5,
        },
      });
    };

    return {
      graficoColunaTemperatura,
      chartSeries,
      chartTemperaturaOptions,
      update,
    };
  },
});
</script>
