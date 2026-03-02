<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="text-h6"> Precipitação </q-card-section>
    <q-card-section>
      <apexchart
        type="bar"
        height="350"
        :options="chartPrecipitacaoOptions"
        :series="chartSeries"
        ref="graficoPrecipitacao"
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
import {
  CHART_PRECIPITACAO_OPTIONS,
  CORES,
  PERIODOS,
} from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "GraficoPrecipitacaoGeral",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    periodoSelecionado: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useObservationStore();
    const graficoPrecipitacao = ref<any>(null);
    const chartSeries = ref<any[]>([]);

    const chartPrecipitacaoOptions = computed(() => CHART_PRECIPITACAO_OPTIONS);
    const stationsMetrics = computed(() => store.stationsMetrics);

    const atualizar = () => {
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
          color: CORES.INDIGO_ESCURO,
        },
        {
          name: "Precipitação restante",
          data: data.map((x) => x.precipitacaoRestante),
          color: CORES.INDIGO,
        },
      ];

      let maxVal = 0;
      const isDiario =
        props.periodoSelecionado === PERIODOS.DIA_ESPECIFICO ||
        props.periodoSelecionado === PERIODOS.HOJE;

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
      atualizar,
    };
  },
});
</script>
