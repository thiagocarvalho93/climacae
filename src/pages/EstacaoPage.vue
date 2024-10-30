<template>
  <!-- Filtros -->
  <SecaoFiltros
    v-model:estacao-selecionada="estacaoSelecionada"
    v-model:periodo-selecionado="periodoSelecionado"
    v-model:dia-selecionado="diaSelecionado"
    v-model:mes-selecionado="mesSelecionado"
    v-model:ano-selecionado="anoSelecionado"
    :nomes-estacoes="nomesEstacoes"
    :carregando="carregando"
    @obter-dados="obterDadosEstacao"
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
          :showing="carregando"
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
          :showing="carregando"
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
          :showing="carregando"
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
          :showing="carregando"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import {
  STATIONS,
  PERIODOS,
  CHART_SERIE_TEMPORAL_OPTIONS,
} from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import SecaoFiltros from "src/components/SecaoFiltros.vue";
import { useObservationStore } from "src/stores/observations";
import { useNotification } from "src/composables/useNotification";

export default {
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

    const graficoTemporalTemperatura = ref(null);
    const graficoTemporalPressao = ref(null);
    const graficoTemporalPrecipitacao = ref(null);
    const graficoTemporalVento = ref(null);

    const carregando = ref(false);
    const dataInicial = ref(new Date());
    const dataFinal = ref(new Date());
    const estacaoSelecionada = ref(Object.values(STATIONS)[0]);
    const periodoSelecionado = ref(PERIODOS.HOJE);
    const diaSelecionado = ref(new Date().getDate());
    const mesSelecionado = ref(new Date().getMonth() + 1);
    const anoSelecionado = ref(new Date().getFullYear());

    const chartSerieTemporalOptions = ref(CHART_SERIE_TEMPORAL_OPTIONS);
    const seriesTemperatura = ref([]);
    const seriesPressao = ref([]);
    const seriesPrecipitacao = ref([]);
    const seriesVento = ref([]);

    const darkMode = computed(() => store.darkMode);
    const estacoes = computed(() => STATIONS);
    const nomesEstacoes = computed(() => Object.values(STATIONS));

    const updateDarkMode = (graficoRef, isDark) => {
      graficoRef.value.updateOptions({
        theme: { mode: isDark ? "dark" : "light" },
        grid: {
          row: {
            colors: isDark
              ? ["#333", "transparent"]
              : ["#e5e5e5", "transparent"],
          },
        },
      });
    };

    const obterDadosEstacao = async () => {
      carregando.value = true;
      try {
        await obterDadosPeriodo();
        atualizarGraficoTemporalTemperatura();
        atualizarGraficoTemporalPressao();
        atualizarGraficoTemporalPrecipitacao();
        atualizarGraficoTemporalVento();
      } catch (error) {
        console.error(error);
        mensagemErro(error.message || "Erro ao obter os dados.");
      } finally {
        carregando.value = false;
      }
    };

    const obterDadosPeriodo = async () => {
      switch (periodoSelecionado.value) {
        case PERIODOS.HOJE:
          setDates(new Date(), new Date());
          await getStationTodayObservations(estacaoSelecionada.value.ID);
          break;
        case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
          setDates(dataUtils.subtrairDias(3), new Date());
          await getStationPeriodDailyObservations(
            estacaoSelecionada.value.ID,
            dataInicial.value,
            dataFinal.value
          );
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          const daysAgo =
            periodoSelecionado.value === PERIODOS.ULTIMOS_SETE_DIAS ? 7 : 30;
          setDates(dataUtils.subtrairDias(daysAgo), new Date());
          await getStationPeriodDailyObservations(
            estacaoSelecionada.value.ID,
            dataInicial.value,
            dataFinal.value
          );
          break;
        case PERIODOS.MES_ESPECIFICO:
          await filtrarMesEspecifico();
          break;
        case PERIODOS.DIA_ESPECIFICO:
          await filtrarDiaEspecifico();
          break;
        default:
          throw new Error("Período inválido!");
      }
    };

    const filtrarMesEspecifico = async () => {
      const { dataFinal, dataInicial } = dataUtils.definirDataInicialEFinalMes(
        mesSelecionado.value,
        anoSelecionado.value
      );

      await getStationPeriodDailyObservations(
        estacaoSelecionada.value.ID,
        dataInicial,
        dataFinal
      );
    };

    const filtrarDiaEspecifico = async () => {
      const hoje = new Date();

      const dataSelecionada = new Date(
        anoSelecionado.value,
        mesSelecionado.value - 1,
        diaSelecionado.value
      );

      if (dataSelecionada > hoje) {
        throw new Error("Não é possivel obter dados do futuro!");
      }

      dataInicial.value = new Date(dataSelecionada);

      await getStationDayObservations(
        estacaoSelecionada.value.ID,
        dataInicial.value
      );
    };

    const setDates = (startDate, endDate) => {
      dataInicial.value = startDate;
      dataFinal.value = endDate;
    };

    const atualizarGraficoTemporal = (chartRef, seriesMap, colors) => {
      const dados = Object.keys(seriesMap).map((serie) => {
        const name = seriesMap[serie].desc;
        return {
          name,
          data: store.stationObservations.map((obs) => [
            dataUtils.subtrairHoras(new Date(obs.obsTimeLocal), 3),
            obs.metric[serie],
          ]),
        };
      });

      chartRef.value.updateOptions({
        series: dados,
        yaxis: {},
        colors,
      });
    };

    const atualizarGraficoTemporalTemperatura = () => {
      const tempMap = {
        tempAvg: { desc: "Média", color: "yellow" },
        tempHigh: { desc: "Máxima", color: "red" },
        tempLow: { desc: "Mínima", color: "blue" },
      };
      atualizarGraficoTemporal(graficoTemporalTemperatura, tempMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    const atualizarGraficoTemporalPressao = () => {
      const pressurePropsMap = {
        pressureMin: { desc: "Mínima", color: "blue" },
        pressureMax: { desc: "Máxima", color: "red" },
      };

      atualizarGraficoTemporal(graficoTemporalPressao, pressurePropsMap, [
        "#6495ED",
        "#FF5733",
      ]);
    };

    const atualizarGraficoTemporalPrecipitacao = () => {
      const precipPropsMap = {
        precipRate: { desc: "Taxa (mm/h)", color: "yellow" },
        precipTotal: { desc: "Total", color: "blue" },
      };

      atualizarGraficoTemporal(graficoTemporalPrecipitacao, precipPropsMap, [
        "#FFD700",
        "#6495ED",
      ]);
    };

    const atualizarGraficoTemporalVento = () => {
      const windPropsMap = {
        windspeedAvg: { desc: "Média", color: "yellow" },
        windspeedHigh: { desc: "Máxima", color: "red" },
        windspeedLow: { desc: "Mínima", color: "blue" },
      };

      atualizarGraficoTemporal(graficoTemporalVento, windPropsMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    onMounted(async () => {
      await obterDadosEstacao();
    });

    // TODO
    // watch(
    //   darkMode,
    //   (isDark) => {
    //     updateDarkMode(graficoTemporalTemperatura, isDark);
    //     updateDarkMode(graficoTemporalPressao, isDark);
    //     updateDarkMode(graficoTemporalPrecipitacao, isDark);
    //     updateDarkMode(graficoTemporalVento, isDark);
    //   },
    //   { immediate: true }
    // );

    return {
      graficoTemporalTemperatura,
      graficoTemporalPressao,
      graficoTemporalPrecipitacao,
      graficoTemporalVento,
      carregando,
      dataInicial,
      dataFinal,
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
      darkMode,
      estacoes,
      nomesEstacoes,
      obterDadosEstacao,
      atualizarGraficoTemporalTemperatura,
    };
  },
};
</script>
