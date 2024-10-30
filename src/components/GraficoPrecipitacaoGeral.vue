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
<script>
import { mapState } from "pinia";
import {
  CHART_PRECIPITACAO_OPTIONS,
  CORES,
  PERIODOS,
} from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default {
  name: "TemperatureChart",
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
  computed: {
    ...mapState(useObservationStore, ["stationsMetrics"]),
    chartPrecipitacaoOptions() {
      return CHART_PRECIPITACAO_OPTIONS;
    },
    periodos() {
      return PERIODOS;
    },
  },
  data() {
    return {
      chartSeries: [],
    };
  },
  created() {
    // TODO;
    // this.$watch(
    //   "$q.dark.isActive",
    //   (isDark) => {
    //     this.$refs.graficoPrecipitacao.updateOptions({
    //       theme: {
    //         mode: isDark ? "dark" : "light",
    //       },
    //     });
    //   },
    //   {
    //     immediate: true,
    //   }
    // );
  },
  methods: {
    atualizar() {
      const dadosFiltrados = this.stationsMetrics.filter(
        (x) =>
          x.precipitacaoMaxima !== (-Infinity || Infinity) &&
          x.precipitacaoAcumulada !== (-Infinity || Infinity)
      );

      const data = dadosFiltrados.map((x) => ({
        name: x.NOME,
        precipitacaoMaxima: x.precipitacaoMaxima,
        precipitacaoRestante: x.precipitacaoAcumulada - x.precipitacaoMaxima,
      }));

      const series = [
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

      let precipitacaoMaxima = 0;
      let isDiario =
        this.periodoSelecionado === this.periodos.DIA_ESPECIFICO ||
        this.periodoSelecionado === this.periodos.HOJE;

      if (isDiario) {
        const precMaximas = data.map((x) => x.precipitacaoMaxima);
        precipitacaoMaxima = Math.max(...precMaximas).toFixed(2);
        series.splice(1, 1); // Remove a série "Precipitação restante"
      } else {
        const precMaximas = data.map(
          (x) => x.precipitacaoMaxima + x.precipitacaoRestante
        );
        precipitacaoMaxima = Math.max(...precMaximas);
      }

      this.$refs.graficoPrecipitacao.updateOptions({
        series,
        xaxis: {
          categories: dadosFiltrados.map((x) =>
            x.id.length > 15 ? `${x.id.substring(0, 15)}...` : x.id
          ),
        },
        yaxis: {
          max: precipitacaoMaxima * 1.4,
          tickAmount: 5,
        },
      });
    },
  },
};
</script>
