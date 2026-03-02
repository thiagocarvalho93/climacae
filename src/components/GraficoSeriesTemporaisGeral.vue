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

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { CHART_SERIE_TEMPORAL_OPTIONS, STATIONS } from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";
import dataUtils from "src/utils/data-utils";

export default defineComponent({
  name: "GraficoSeriesTemporaisGeral",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useObservationStore();
    const graficoTemporal = ref<any>(null);
    const chartSeries = ref<any[]>([]);

    const chartOptions = computed(() => CHART_SERIE_TEMPORAL_OPTIONS);
    const observations = computed(() => store.observations);

    const atualizar = () => {
      const dados = Object.keys(STATIONS).map((estacaoId) => {
        const estacao = STATIONS[estacaoId];
        return {
          name: estacao.NOME,
          data: observations.value.reduce((acc: any[], ob) => {
            if (ob.stationID === estacaoId && ob.metric && ob.metric.tempAvg !== undefined && ob.metric.tempAvg !== "") {
              acc.push([
                dataUtils.subtrairHoras(new Date(ob.obsTimeLocal as string), 3),
                ob.metric.tempAvg,
              ]);
            }
            return acc;
          }, []),
        };
      });
      graficoTemporal.value?.updateSeries(dados);
    };

    return {
      graficoTemporal,
      chartSeries,
      chartOptions,
      atualizar,
    };
  },
});
</script>
