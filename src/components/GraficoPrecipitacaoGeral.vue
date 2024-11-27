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
import { useStatisticsStore } from "src/stores/statistics";
import stringUtil from "src/utils/string-util";

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
    ...mapState(useStatisticsStore, ["stations", "maxPrecipitation"]),
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
      const data = this.stations.map((x) => ({
        name: x.NOME,
        precipitacaoMaxima: x.maxPrecipitation,
      }));

      const series = [
        {
          name: "Máxima em 24h",
          data: data.map((x) => x.precipitacaoMaxima),
          color: CORES.INDIGO_ESCURO,
        },
      ];

      this.$refs.graficoPrecipitacao.updateOptions({
        series,
        xaxis: {
          categories: this.stations.map((x) =>
            stringUtil.limitString(x.stationId, 15)
          ),
        },
        yaxis: {
          max: this.maxPrecipitation * 1.4,
          tickAmount: 5,
        },
      });
    },
  },
};
</script>
