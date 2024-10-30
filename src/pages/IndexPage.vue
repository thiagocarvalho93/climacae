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
import { defineComponent } from "vue";
import {
  STATIONS,
  PERIODOS,
  CHART_SERIE_TEMPORAL_OPTIONS,
  COLUNAS_TABELA,
} from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import { mapActions, mapState } from "pinia";
import { useObservationStore } from "src/stores/observations";

import RealTimeObservationsCarousel from "src/components/RealTimeObservationsCarousel.vue";
import InformacaoCard from "src/components/InformacaoCard.vue";
import TabelaObservacoes from "src/components/TabelaObservacoes.vue";
import SecaoFiltros from "src/components/SecaoFiltros.vue";
import GraficoTemperaturaGeral from "src/components/GraficoTemperaturaGeral.vue";
import GraficoPrecipitacaoGeral from "src/components/GraficoPrecipitacaoGeral.vue";
import GraficoSeriesTemporaisGeral from "src/components/GraficoSeriesTemporaisGeral.vue";

export default defineComponent({
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

  computed: {
    ...mapState(useObservationStore, [
      "observations",
      "stationsMetrics",
      "maxValues",
    ]),

    darkMode() {
      return this.$q.dark.isActive;
    },

    estacoes() {
      return STATIONS;
    },

    nomesEstacoes() {
      return Object.values(STATIONS);
    },

    idsEstacoes() {
      return Object.keys(STATIONS);
    },

    periodos() {
      return PERIODOS;
    },

    colunasTabela() {
      return COLUNAS_TABELA;
    },

    chartSerieTemporalOptions() {
      return CHART_SERIE_TEMPORAL_OPTIONS;
    },
  },
  data() {
    return {
      //estados
      carregando: true,
      mostrarInformacoesCard: [true, true, true, true],
      autoplayCarousel: true,
      //inputs
      estacaoSelecionada: Object.values(STATIONS)[0],
      periodoSelecionado: PERIODOS.HOJE,
      diaSelecionado: new Date().getDate(),
      mesSelecionado: new Date().getMonth() + 1,
      anoSelecionado: new Date().getFullYear(),
      dataInicial: new Date(),
      dataFinal: new Date(),
      //outputs
      dadosMinima: [],
      dadosMaxima: [],
      dadosVentoMaximo: [],
      dadosPrecipitacaoMaxima: [],
      minima: 0,
      maxima: 0,
      precipitacaoMaxima: 0,
      ventoMaximo: 0,
      //gráficos
      seriesTemporal: [],
    };
  },

  async created() {
    await this.obterCalcularEAtualizar();
  },

  methods: {
    ...mapActions(useObservationStore, [
      "getTodayObservations",
      "getSpecificDayObservations",
      "getPeriodDailyObservations",
      "setStartDate",
      "setEndDate",
      "calculateMetrics",
      "calculateMaxValues",
    ]),

    async obterCalcularEAtualizar() {
      this.carregando = true;

      try {
        await this.filtrarDadosPeriodo();

        this.calculateMetrics();
        this.calculateMaxValues();
        this.$refs.graficoTemperatura.atualizar();
        this.$refs.graficoPrecipitacao.atualizar();
        this.$refs.graficoTemporal.atualizar();
      } catch (error) {
        const mensagem = (error && error.message) || "Erro ao obter os dados.";
        this.mensagemErro(mensagem);
      } finally {
        this.carregando = false;
      }
    },

    mensagemErro(mensagem) {
      this.$q.notify({
        message: mensagem,
        type: "negative",
        progress: true,
        position: "top",
        actions: [
          {
            label: "Fechar",
            color: "white",
            handler: () => {},
          },
        ],
      });
    },

    mensagemSucesso(mensagem) {
      this.$q.notify({
        message: mensagem,
        type: "positive",
        progress: true,
        position: "top",
        actions: [
          {
            label: "Fechar",
            color: "white",
            handler: () => {},
          },
        ],
      });
    },

    async filtrarDadosPeriodo() {
      switch (this.periodoSelecionado) {
        case PERIODOS.HOJE:
          this.setStartDate(new Date());
          this.setEndDate(new Date());
          this.setDates(new Date(), new Date());
          await this.getTodayObservations(this.idsEstacoes);
          break;
        case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
          const dias = 3;

          this.setDates(dataUtils.subtrairDias(dias), new Date());
          this.setStartDate(dataUtils.subtrairDias(dias));
          this.setEndDate(new Date());
          await this.getPeriodDailyObservations(
            this.idsEstacoes,
            this.dataInicial,
            this.dataFinal
          );
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          const diasAtras =
            this.periodoSelecionado === PERIODOS.ULTIMOS_SETE_DIAS ? 7 : 30;

          this.setDates(dataUtils.subtrairDias(diasAtras), new Date());
          this.setStartDate(dataUtils.subtrairDias(diasAtras));
          this.setEndDate(new Date());
          await this.getPeriodDailyObservations(
            this.idsEstacoes,
            this.dataInicial,
            this.dataFinal
          );
          break;
        case PERIODOS.MES_ESPECIFICO:
          await this.filtrarMesEspecifico(
            this.mesSelecionado,
            this.anoSelecionado
          );
          break;
        case PERIODOS.DIA_ESPECIFICO:
          await this.filtrarDiaEspecifico();
          break;
        default:
          throw new Error("Período inválido!");
      }
    },

    setDates(startDate, endDate) {
      this.dataInicial = startDate;
      this.dataFinal = endDate;
    },

    async filtrarMesEspecifico(mes, ano) {
      const { dataInicial, dataFinal } = dataUtils.definirDataInicialEFinalMes(
        mes,
        ano
      );
      this.setDates(dataInicial, dataFinal);
      this.setStartDate(dataInicial);
      this.setEndDate(dataFinal);

      await this.getPeriodDailyObservations(
        this.idsEstacoes,
        this.dataInicial,
        this.dataFinal
      );
    },

    async filtrarDiaEspecifico() {
      const hoje = new Date();

      const dataSelecionada = new Date(
        this.anoSelecionado,
        this.mesSelecionado - 1,
        this.diaSelecionado
      );

      if (dataSelecionada > hoje) {
        throw new Error("Não é possivel obter dados do futuro!");
      }

      this.dataInicial = new Date(dataSelecionada);

      await this.getSpecificDayObservations(this.idsEstacoes, this.dataInicial);
    },

    formatarDataCard(dados) {
      if (!dados || !dados.obsTimeLocal) return "N/A";
      return new Date(dados.obsTimeLocal).toLocaleDateString();
    },

    formatarTituloCard(dados) {
      if (!dados || !dados.stationID) return "Sem dados";

      const idEstacao = dados.stationID;
      return `Em ${this.estacoes[idEstacao]?.NOME} (${idEstacao})`;
    },
  },
});
</script>
