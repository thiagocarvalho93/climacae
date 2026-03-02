<template>
  <!-- Filtros -->
  <SecaoFiltros
    v-model:estacao-selecionada="estacaoSelecionada"
    v-model:periodo-selecionado="periodoSelecionado"
    v-model:dia-selecionado="diaSelecionado"
    v-model:mes-selecionado="mesSelecionado"
    v-model:ano-selecionado="anoSelecionado"
    :nomes-estacoes="nomesEstacoes"
    :carregando="loading"
    @obter-dados="handleFiltrar"
  />

  <!-- Gráficos -->
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6"> Temperatura (°C) </q-card-section>
        <q-card-section>
          <apexchart
            height="250"
            :options="chartSerieTemporalOptions"
            :series="seriesTemperatura"
            ref="graficoTemporalTemperatura"
          ></apexchart>
        </q-card-section>
        <q-inner-loading
          :showing="loading"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>

    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6"> Pressão (hPa)</q-card-section>
        <q-card-section>
          <apexchart
            height="250"
            :options="chartSerieTemporalOptions"
            :series="seriesPressao"
            ref="graficoTemporalPressao"
          ></apexchart>
        </q-card-section>
        <q-inner-loading
          :showing="loading"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>

    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6"> Precipitação (mm) </q-card-section>
        <q-card-section>
          <apexchart
            height="250"
            :options="chartSerieTemporalOptions"
            :series="seriesPrecipitacao"
            ref="graficoTemporalPrecipitacao"
          ></apexchart>
        </q-card-section>
        <q-inner-loading
          :showing="loading"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>

    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6">
          Velocidade do vento (km/h)</q-card-section
        >
        <q-card-section>
          <apexchart
            height="250"
            :options="chartSerieTemporalOptions"
            :series="seriesVento"
            ref="graficoTemporalVento"
          >
          </apexchart>
        </q-card-section>
        <q-inner-loading
          :showing="loading"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from "vue";
import { STATIONS, CHART_SERIE_TEMPORAL_OPTIONS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import SecaoFiltros from "src/components/SecaoFiltros.vue";
import { useObservationStore } from "src/stores/observations";
import { useNotification } from "src/composables/useNotification";
import { useDateRangeSetter } from "src/composables/useDateRangeSetter";
import { SeriesConfig } from "src/types/chart-types";
import { downsampleLTTB, DataPoint } from "src/utils/downsample-utils";

export default defineComponent({
  name: "EstacaoPage",
  components: { SecaoFiltros },

  setup() {
    const store = useObservationStore();
    const { mensagemErro } = useNotification();

    const {
      getStationPeriodDailyObservations,
      getStationTodayObservations,
      getStationDayObservations,
    } = store;

    const graficoTemporalTemperatura = ref<any>(null);
    const graficoTemporalPressao = ref<any>(null);
    const graficoTemporalPrecipitacao = ref<any>(null);
    const graficoTemporalVento = ref<any>(null);

    const loading = ref(false);
    const estacaoSelecionada = ref(Object.values(STATIONS)[0]);

    const {
      dataFinal,
      dataInicial,
      periodoSelecionado,
      anoSelecionado,
      diaSelecionado,
      mesSelecionado,
      setDatesGivenPeriod,
    } = useDateRangeSetter();

    const chartSerieTemporalOptions = ref(CHART_SERIE_TEMPORAL_OPTIONS);
    const seriesTemperatura = ref([]);
    const seriesPressao = ref([]);
    const seriesPrecipitacao = ref([]);
    const seriesVento = ref([]);

    const nomesEstacoes = computed(() => Object.values(STATIONS));

    const handleFiltrar = async () => {
      loading.value = true;
      try {
        setDatesGivenPeriod();
        await fetchStationObservationsData();

        updateGraphs();
      } catch (error: any) {
        console.error(error);
        mensagemErro(error.message || "Erro ao obter os dados.");
      } finally {
        loading.value = false;
      }
    };

    const fetchStationObservationsData = async () => {
      if (!dataFinal.value && dataUtils.isToday(dataInicial.value)) {
        await getStationTodayObservations(estacaoSelecionada.value.ID);
      } else if (!dataFinal.value) {
        await getStationDayObservations(
          estacaoSelecionada.value.ID,
          dataInicial.value
        );
      } else {
        await getStationPeriodDailyObservations(
          estacaoSelecionada.value.ID,
          dataInicial.value,
          dataFinal.value
        );
      }
    };

    function updateGraphs() {
      updateTemperatureGraph();
      updatePressureGraph();
      updatePrecipitationGraph();
      updateWindGraph();
    }

    const updateGraphOptions = (
      chartRef: any,
      seriesMap: SeriesConfig,
      colors: string[]
    ) => {
      const dados = Object.keys(seriesMap).map((serie) => {
        const name = seriesMap[serie].desc;
        const rawData: DataPoint[] = store.stationObservations
          .filter((obs) => obs.metric && (obs.metric as any)[serie] !== undefined && (obs.metric as any)[serie] !== "")
          .map((obs) => [
            dataUtils.subtrairHoras(new Date(obs.obsTimeLocal as string), 3),
            Number((obs.metric as any)[serie]),
          ]);

        // Downsample if more than 500 points
        const finalData = downsampleLTTB(rawData, 500);

        return {
          name,
          data: finalData,
        };
      });

      chartRef.value.updateOptions({
        series: dados,
        yaxis: {},
        colors,
      });
    };

    const updateTemperatureGraph = () => {
      const tempMap: SeriesConfig = {
        tempAvg: { desc: "Média", color: "yellow" },
        tempHigh: { desc: "Máxima", color: "red" },
        tempLow: { desc: "Mínima", color: "blue" },
      };
      updateGraphOptions(graficoTemporalTemperatura, tempMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    const updatePressureGraph = () => {
      const pressurePropsMap: SeriesConfig = {
        pressureMin: { desc: "Mínima", color: "blue" },
        pressureMax: { desc: "Máxima", color: "red" },
      };

      updateGraphOptions(graficoTemporalPressao, pressurePropsMap, [
        "#6495ED",
        "#FF5733",
      ]);
    };

    const updatePrecipitationGraph = () => {
      const precipPropsMap: SeriesConfig = {
        precipRate: { desc: "Taxa (mm/h)", color: "yellow" },
        precipTotal: { desc: "Total", color: "blue" },
      };

      updateGraphOptions(graficoTemporalPrecipitacao, precipPropsMap, [
        "#FFD700",
        "#6495ED",
      ]);
    };

    const updateWindGraph = () => {
      const windPropsMap: SeriesConfig = {
        windspeedAvg: { desc: "Média", color: "yellow" },
        windspeedHigh: { desc: "Máxima", color: "red" },
        windspeedLow: { desc: "Mínima", color: "blue" },
      };

      updateGraphOptions(graficoTemporalVento, windPropsMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    onMounted(async () => {
      await handleFiltrar();
    });

    return {
      graficoTemporalTemperatura,
      graficoTemporalPressao,
      graficoTemporalPrecipitacao,
      graficoTemporalVento,
      loading,
      estacaoSelecionada,
      periodoSelecionado,
      diaSelecionado,
      mesSelecionado,
      anoSelecionado,
      chartSerieTemporalOptions,
      seriesTemperatura,
      seriesPressao,
      seriesPrecipitacao,
      seriesVento,
      nomesEstacoes,
      handleFiltrar,
    };
  },
});
</script>
