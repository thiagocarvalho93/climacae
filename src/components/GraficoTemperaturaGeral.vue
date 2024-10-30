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
import { useObservationStore } from "src/stores/observations";

export default {
  name: "TemperatureChart",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useObservationStore, ["stationsMetrics"]),
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
      const dadosFiltrados = this.stationsMetrics.filter(
        (x) => x.maxima != -Infinity || x.minima != Infinity
      );

      this.$refs.graficoColunaTemperatura.updateOptions({
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
          // min: this.minima * 0.8,
          tickAmount: 5,
        },
      });
    },
  },
};
</script>
