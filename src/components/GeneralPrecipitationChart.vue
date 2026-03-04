<template>
  <q-card flat bordered class="full-width overflow-hidden fade">
    <q-card-section class="q-pa-none">
      <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
        <q-icon name="ion-rainy" size="xs" class="q-mr-sm" color="indigo-5" />
        <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
          Precipitação por Estação
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <apexchart
        type="bar"
        height="350"
        :options="chartPrecipitacaoOptions"
        :series="chartSeries"
        ref="graficoPrecipitacao"
      ></apexchart>
    </q-card-section>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="40px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import {
  PRECIPITATION_CHART_OPTIONS,
  COLORS,
  PERIODS,
} from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "GeneralPrecipitationChart",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    selectedPeriod: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useObservationStore();
    const graficoPrecipitacao = ref<any>(null);
    const chartSeries = ref<any[]>([]);

    const chartPrecipitacaoOptions = computed(() => PRECIPITATION_CHART_OPTIONS);
    const stationsMetrics = computed(() => store.stationsMetrics);

    const update = () => {
      const dadosFiltrados = stationsMetrics.value.filter(
        (x) =>
          x.precipitacaoMaxima !== -Infinity &&
          x.precipitacaoMaxima !== Infinity &&
          x.precipitacaoAcumulada !== -Infinity &&
          x.precipitacaoAcumulada !== Infinity
      );

      const data = dadosFiltrados.map((x) => ({
        name: x.id,
        precipitacaoMaxima: x.precipitacaoMaxima,
        precipitacaoRestante: x.precipitacaoAcumulada - x.precipitacaoMaxima,
      }));

      const series: any[] = [
        {
          name: "Máxima em 24h",
          data: data.map((x) => x.precipitacaoMaxima),
          color: COLORS.INDIGO_DARK,
        },
        {
          name: "Precipitação restante",
          data: data.map((x) => x.precipitacaoRestante),
          color: COLORS.INDIGO,
        },
      ];

      let maxVal = 0;
      const isDiario =
        props.selectedPeriod === PERIODS.SPECIFIC_DAY ||
        props.selectedPeriod === PERIODS.TODAY;

      if (isDiario) {
        const precMaximas = data.map((x) => x.precipitacaoMaxima);
        maxVal = precMaximas.length > 0 ? Math.max(...precMaximas) : 0;
        series.splice(1, 1); // Remove "Precipitação restante"
      } else {
        const precMaximas = data.map(
          (x) => x.precipitacaoMaxima + x.precipitacaoRestante
        );
        maxVal = precMaximas.length > 0 ? Math.max(...precMaximas) : 0;
      }

      graficoPrecipitacao.value?.updateOptions({
        series,
        xaxis: {
          categories: dadosFiltrados.map((x) =>
            x.id.length > 15 ? `${x.id.substring(0, 15)}...` : x.id
          ),
        },
        yaxis: {
          max: maxVal > 0 ? maxVal * 1.4 : undefined,
          tickAmount: 5,
        },
      });
    };

    return {
      graficoPrecipitacao,
      chartSeries,
      chartPrecipitacaoOptions,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
// Using global styles for border-bottom, dark-header, letter-spacing-1, etc.
</style>
