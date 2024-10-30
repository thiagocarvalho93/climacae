<template>
  <!-- Filtros -->
  <SecaoFiltros
    v-model:periodo-selecionado="periodoSelecionado"
    v-model:dia-selecionado="diaSelecionado"
    v-model:mes-selecionado="mesSelecionado"
    v-model:ano-selecionado="anoSelecionado"
    :carregando="carregando"
    @obterDados="obterCalcularEAtualizar"
  />

  <!-- Cards -->
  <div class="row q-col-gutter-md fade">
    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :carregando="carregando"
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
        :carregando="carregando"
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
        :carregando="carregando"
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
        :carregando="carregando"
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
      <GraficoTemperaturaGeral :loading="carregando" ref="graficoTemperatura" />
    </div>

    <div class="col-12 col-sm-5 flex">
      <GraficoPrecipitacaoGeral
        :loading="carregando"
        :periodo-selecionado="periodoSelecionado"
        ref="graficoPrecipitacao"
      />
    </div>

    <div class="col-12 col-sm-7 flex">
      <GraficoSeriesTemporaisGeral
        :loading="carregando"
        ref="graficoTemporal"
      />
    </div>

    <!-- Tabela -->
    <div class="col-12">
      <TabelaObservacoes
        :rows="observations"
        :columns="colunasTabela"
        :loading="carregando"
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
import { STATIONS, PERIODOS, COLUNAS_TABELA } from "../constants/constants";
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

    const carregando = ref(true);
    const periodoSelecionado = ref(PERIODOS.HOJE);
    const diaSelecionado = ref(new Date().getDate());
    const mesSelecionado = ref(new Date().getMonth() + 1);
    const anoSelecionado = ref(new Date().getFullYear());
    const dataInicial = ref(new Date());
    const dataFinal = ref(new Date());

    const graficoTemperatura = ref(null);
    const graficoPrecipitacao = ref(null);
    const graficoTemporal = ref(null);

    const observations = computed(() => observationStore.observations);
    const stationsMetrics = computed(() => observationStore.stationsMetrics);
    const maxValues = computed(() => observationStore.maxValues);
    const darkMode = computed(() => $q.dark.isActive);
    const estacoes = computed(() => STATIONS);
    const nomesEstacoes = computed(() => Object.values(STATIONS));
    const idsEstacoes = computed(() => Object.keys(STATIONS));
    const periodos = computed(() => PERIODOS);
    const colunasTabela = computed(() => COLUNAS_TABELA);

    const obterCalcularEAtualizar = async () => {
      carregando.value = true;

      try {
        await filtrarDadosPeriodo();
        observationStore.calculateMetrics();
        observationStore.calculateMaxValues();
        graficoTemperatura.value?.atualizar();
        graficoPrecipitacao.value?.atualizar();
        graficoTemporal.value?.atualizar();
      } catch (error) {
        mensagemErro((error && error.message) || "Erro ao obter os dados.");
      } finally {
        carregando.value = false;
      }
    };

    const filtrarDadosPeriodo = async () => {
      try {
        switch (periodoSelecionado.value) {
          case PERIODOS.HOJE:
            setDates(new Date(), new Date());
            await observationStore.getTodayObservations(idsEstacoes.value);
            break;
          case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
            const dias = 3;
            setDates(dataUtils.subtrairDias(dias), new Date());
            await observationStore.getPeriodDailyObservations(
              idsEstacoes.value,
              dataInicial.value,
              dataFinal.value
            );
            break;
          case PERIODOS.ULTIMOS_SETE_DIAS:
          case PERIODOS.ULTIMOS_TRINTA_DIAS:
            const diasAtras =
              periodoSelecionado.value === PERIODOS.ULTIMOS_SETE_DIAS ? 7 : 30;
            setDates(dataUtils.subtrairDias(diasAtras), new Date());
            await observationStore.getPeriodDailyObservations(
              idsEstacoes.value,
              dataInicial.value,
              dataFinal.value
            );
            break;
          case PERIODOS.MES_ESPECIFICO:
            await filtrarMesEspecifico(
              mesSelecionado.value,
              anoSelecionado.value
            );
            break;
          case PERIODOS.DIA_ESPECIFICO:
            await filtrarDiaEspecifico();
            break;
          default:
            throw new Error("Período inválido!");
        }
      } catch (error) {
        mensagemErro(error.message);
      }
    };

    const setDates = (startDate, endDate) => {
      dataInicial.value = startDate;
      dataFinal.value = endDate;
    };

    const filtrarMesEspecifico = async (mes, ano) => {
      const { dataInicial: start, dataFinal: end } =
        dataUtils.definirDataInicialEFinalMes(mes, ano);
      setDates(start, end);
      await observationStore.getPeriodDailyObservations(
        idsEstacoes.value,
        dataInicial.value,
        dataFinal.value
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
        throw new Error("Não é possível obter dados do futuro!");
      }
      dataInicial.value = dataSelecionada;
      await observationStore.getSpecificDayObservations(
        idsEstacoes.value,
        dataInicial.value
      );
    };

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
      obterCalcularEAtualizar();
    });

    return {
      carregando,
      periodoSelecionado,
      diaSelecionado,
      mesSelecionado,
      anoSelecionado,
      dataInicial,
      dataFinal,
      observations,
      stationsMetrics,
      maxValues,
      darkMode,
      estacoes,
      nomesEstacoes,
      idsEstacoes,
      periodos,
      colunasTabela,
      obterCalcularEAtualizar,
      formatarTituloCard,
      formatarDataCard,
      graficoTemperatura,
      graficoPrecipitacao,
      graficoTemporal,
    };
  },
};
</script>
