<template>
  <q-card flat bordered class="full-width">
    <q-card-section class="text-h6">
      <div class="row">
        <div class="col-12 col-sm-8 col-md-10">
          <span>Séries temporais</span>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <apexchart
        height="350"
        :options="chartOptions"
        :series="chartSeries"
        ref="graficoTemporal"
      />
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
  CHART_SERIE_TEMPORAL_OPTIONS,
  PERIODOS,
  STATIONS,
} from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";
import dataUtils from "src/utils/data-utils";

export default {
  name: "TemperatureChart",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useObservationStore, ["observations"]),
    chartOptions() {
      return CHART_SERIE_TEMPORAL_OPTIONS;
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
    //     this.$refs.graficoTemporal.updateOptions({
    //       theme: {
    //         mode: isDark ? "dark" : "light",
    //       },
    //       grid: {
    //         row: {
    //           colors: isDark
    //             ? ["#333", "transparent"]
    //             : ["#e5e5e5", "transparent"],
    //         },
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
      const dados = Object.keys(STATIONS).map((estacao) => ({
        name: STATIONS[estacao].NOME,
        data: this.observations.reduce((acc, ob) => {
          if (ob.stationID === estacao && ob.metric.tempAvg) {
            acc.push([
              dataUtils.subtrairHoras(new Date(ob.obsTimeLocal), 3),
              ob.metric.tempAvg,
            ]);
          }
          return acc;
        }, []),
      }));
      this.$refs.graficoTemporal.updateSeries(dados);
    },
  },
};
</script>
