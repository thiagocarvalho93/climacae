<template>
  <!-- Filtros -->
  <SecaoFiltros
    v-model:periodo-selecionado="periodoSelecionado"
    v-model:dia-selecionado="diaSelecionado"
    v-model:mes-selecionado="mesSelecionado"
    v-model:ano-selecionado="anoSelecionado"
    :loading="loading"
    @obterDados="handleFiltrar"
  />

  <!-- Cards -->
  <div class="row q-col-gutter-md fade">
    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :loading="loading"
        titulo="MÁXIMA"
        :descricao="`${maxValues.maxima}°C`"
        icone="thermostat"
        cor-icone="red-5"
        :titulo-verso="formatarTituloCard(maxValues.dadosMaxima)"
        :descricao-verso="formatarDataCard(maxValues.dadosMaxima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :loading="loading"
        titulo="MÍNIMA"
        :descricao="`${maxValues.minima}°C`"
        icone="thermostat"
        cor-icone="blue-5"
        :titulo-verso="formatarTituloCard(maxValues.dadosMinima)"
        :descricao-verso="formatarDataCard(maxValues.dadosMinima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :loading="loading"
        titulo="VENTO MÁXIMO"
        :descricao="`${maxValues.ventoMaximo} km/h`"
        icone="wind_power"
        cor-icone="green-5"
        :titulo-verso="formatarTituloCard(maxValues.dadosVentoMaximo)"
        :descricao-verso="formatarDataCard(maxValues.dadosVentoMaximo)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :loading="loading"
        titulo="PRECIPITAÇÃO MÁXIMA"
        :descricao="`${maxValues.precipitacaoMaxima}mm`"
        icone="ion-rainy"
        cor-icone="deep-purple-5"
        :titulo-verso="formatarTituloCard(maxValues.dadosPrecipitacaoMaxima)"
        :descricao-verso="formatarDataCard(maxValues.dadosPrecipitacaoMaxima)"
      />
    </div>

    <!-- Carrocel -->
    <div class="col-12 col-md-3 flex">
      <RealTimeObservationsCarousel
        :estacoes="estacoes"
        :dark-mode="darkMode"
      />
    </div>

    <!-- Gráficos -->
    <div class="col-12 col-md-9 flex">
      <GraficoTemperaturaGeral :loading="loading" ref="graficoTemperatura" />
    </div>

    <div class="col-12 col-sm-5 flex">
      <GraficoPrecipitacaoGeral
        :loading="loading"
        :periodo-selecionado="periodoSelecionado"
        ref="graficoPrecipitacao"
      />
    </div>

    <div class="col-12 col-sm-7 flex">
      <GraficoSeriesTemporaisGeral :loading="loading" ref="graficoTemporal" />
    </div>

    <!-- Tabela -->
    <div class="col-12">
      <TabelaObservacoes
        :rows="observations"
        :columns="colunasTabela"
        :loading="loading"
        :data-final="dataFinal"
        :data-inicial="dataInicial"
        :periodo-selecionado="periodoSelecionado"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useObservationStore } from "src/stores/observations";
import { STATIONS, COLUNAS_TABELA } from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import { useQuasar } from "quasar";
import RealTimeObservationsCarousel from "src/components/RealTimeObservationsCarousel.vue";
import InformacaoCard from "src/components/InformacaoCard.vue";
import TabelaObservacoes from "src/components/TabelaObservacoes.vue";
import SecaoFiltros from "src/components/SecaoFiltros.vue";
import GraficoTemperaturaGeral from "src/components/GraficoTemperaturaGeral.vue";
import GraficoPrecipitacaoGeral from "src/components/GraficoPrecipitacaoGeral.vue";
import GraficoSeriesTemporaisGeral from "src/components/GraficoSeriesTemporaisGeral.vue";
import { useNotification } from "src/composables/useNotification";
import { useDateRangeSetter } from "src/composables/useDateRangeSetter";

export default {
  name: "IndexPage",
  components: {
    RealTimeObservationsCarousel,
    InformacaoCard,
    TabelaObservacoes,
    SecaoFiltros,
    GraficoTemperaturaGeral,
    GraficoPrecipitacaoGeral,
    GraficoSeriesTemporaisGeral,
  },
  setup() {
    const $q = useQuasar();
    const observationStore = useObservationStore();
    const { mensagemErro } = useNotification();

    const loading = ref(true);

    const {
      dataFinal,
      dataInicial,
      periodoSelecionado,
      anoSelecionado,
      diaSelecionado,
      mesSelecionado,
      setDatesGivenPeriod,
    } = useDateRangeSetter();

    const graficoTemperatura = ref(null);
    const graficoPrecipitacao = ref(null);
    const graficoTemporal = ref(null);

    const observations = computed(() => observationStore.observations);
    const maxValues = computed(() => observationStore.maxValues);
    const darkMode = computed(() => $q.dark.isActive);
    const estacoes = computed(() => STATIONS);
    const idsEstacoes = computed(() => Object.keys(STATIONS));
    const colunasTabela = computed(() => COLUNAS_TABELA);

    const handleFiltrar = async () => {
      loading.value = true;

      try {
        setDatesGivenPeriod();
        await fetchObservationsData();
        calculate();
        updateGraphs();
      } catch (error) {
        mensagemErro((error && error.message) || "Erro ao obter os dados.");
      } finally {
        loading.value = false;
      }
    };

    const fetchObservationsData = async () => {
      if (!dataFinal.value && dataUtils.isToday(dataInicial.value)) {
        await observationStore.getTodayObservations(idsEstacoes.value);
      } else if (!dataFinal.value) {
        await observationStore.getSpecificDayObservations(
          idsEstacoes.value,
          dataInicial.value
        );
      } else {
        await observationStore.getPeriodDailyObservations(
          idsEstacoes.value,
          dataInicial.value,
          dataFinal.value
        );
      }
    };

    function calculate() {
      observationStore.calculateMetrics();
      observationStore.calculateMaxValues();
    }

    function updateGraphs() {
      graficoTemperatura.value?.atualizar();
      graficoPrecipitacao.value?.atualizar();
      graficoTemporal.value?.atualizar();
    }

    const formatarDataCard = (dados) => {
      if (!dados || !dados.obsTimeLocal) return "N/A";
      return new Date(dados.obsTimeLocal).toLocaleDateString();
    };

    const formatarTituloCard = (dados) => {
      if (!dados || !dados.stationID) return "Sem dados";

      const idEstacao = dados.stationID;
      return `Em ${estacoes.value[idEstacao]?.NOME} (${idEstacao})`;
    };

    onMounted(() => {
      handleFiltrar();
    });

    return {
      loading,
      periodoSelecionado,
      diaSelecionado,
      mesSelecionado,
      anoSelecionado,
      dataInicial,
      dataFinal,
      observations,
      maxValues,
      darkMode,
      estacoes,
      idsEstacoes,
      colunasTabela,
      handleFiltrar,
      formatarTituloCard,
      formatarDataCard,
      graficoTemperatura,
      graficoPrecipitacao,
      graficoTemporal,
    };
  },
};
</script>
