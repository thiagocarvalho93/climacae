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

<script>
import { mapState } from "pinia";
import { CHART_TEMPERATURA_OPTIONS, CORES } from "src/constants/constants";
import { useStatisticsStore } from "src/stores/statistics";
import stringUtil from "src/utils/string-util";

export default {
  name: "TemperatureChart",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useStatisticsStore, ["stations", "minTemp"]),
    chartTemperaturaOptions() {
      return CHART_TEMPERATURA_OPTIONS;
    },
  },
  data() {
    return {
      chartSeries: [],
    };
  },
  created() {
    // TODO
    // this.$watch(
    //   "$q.dark.isActive",
    //   (isDark) => {
    //     this.$refs.graficoColunaTemperatura.updateOptions({
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
      this.$refs.graficoColunaTemperatura.updateOptions({
        series: [
          {
            name: "Máxima",
            color: CORES.VERMELHO,
            data: this.stations.map((x) => x.maxTemp),
          },
          {
            name: "Mínima",
            color: CORES.AZUL,
            data: this.stations.map((x) => x.minTemp),
          },
        ],
        xaxis: {
          categories: this.stations.map((x) =>
            stringUtil.limitString(x.stationId, 12)
          ),
        },
        yaxis: {
          min: this.minTemp.value * 0.8,
          tickAmount: 5,
        },
      });
    },
  },
};
</script>
