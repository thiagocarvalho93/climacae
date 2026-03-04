<template>
  <q-card flat bordered class="full-width overflow-hidden fade">
    <q-card-section class="q-pa-none">
      <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
        <q-icon name="thermostat" size="xs" class="q-mr-sm" color="red-5" />
        <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
          Temperaturas Máximas e Mínimas
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <apexchart
        type="bar"
        height="280"
        :options="chartTemperaturaOptions"
        :series="chartSeries"
        ref="graficoColunaTemperatura"
      ></apexchart>
    </q-card-section>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="40px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { TEMPERATURE_CHART_OPTIONS, COLORS } from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "GeneralTemperatureChart",
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

    const chartTemperaturaOptions = computed(() => TEMPERATURE_CHART_OPTIONS);
    const stationsMetrics = computed(() => store.stationsMetrics);

    const update = () => {
      const dadosFiltrados = stationsMetrics.value.filter(
        (x) => x.maxima !== -Infinity && x.minima !== Infinity
      );

      graficoColunaTemperatura.value?.updateOptions({
        series: [
          {
            name: "Máxima",
            color: COLORS.RED,
            data: dadosFiltrados.map((x) => x.maxima),
          },
          {
            name: "Mínima",
            color: COLORS.BLUE,
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

<style lang="scss" scoped>
// Using global styles for border-bottom, dark-header, letter-spacing-1, etc.
</style>
