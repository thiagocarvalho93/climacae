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
        :descricao="`${maxima}°C`"
        icone="thermostat"
        cor-icone="red-5"
        :titulo-verso="formatarTituloCard(dadosMaxima)"
        :descricao-verso="formatarDataCard(dadosMaxima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :carregando="carregando"
        titulo="MÍNIMA"
        :descricao="`${minima}°C`"
        icone="thermostat"
        cor-icone="blue-5"
        :titulo-verso="formatarTituloCard(dadosMinima)"
        :descricao-verso="formatarDataCard(dadosMinima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :carregando="carregando"
        titulo="VENTO MÁXIMO"
        :descricao="`${ventoMaximo} km/h`"
        icone="wind_power"
        cor-icone="green-5"
        :titulo-verso="formatarTituloCard(dadosVentoMaximo)"
        :descricao-verso="formatarDataCard(dadosVentoMaximo)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InformacaoCard
        :carregando="carregando"
        titulo="PRECIPITAÇÃO MÁXIMA"
        :descricao="`${precipitacaoMaxima}mm`"
        icone="ion-rainy"
        cor-icone="deep-purple-5"
        :titulo-verso="formatarTituloCard(dadosPrecipitacaoMaxima)"
        :descricao-verso="formatarDataCard(dadosPrecipitacaoMaxima)"
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
            :options="chartSerieTemporalOptions"
            :series="seriesTemporal"
            ref="graficoTemporal"
          />
        </q-card-section>
        <q-inner-loading
          :showing="carregando"
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
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

export default defineComponent({
  name: "IndexPage",

  components: {
    RealTimeObservationsCarousel,
    InformacaoCard,
    TabelaObservacoes,
    SecaoFiltros,
    GraficoTemperaturaGeral,
    GraficoPrecipitacaoGeral,
  },

  computed: {
    ...mapState(useObservationStore, ["observations", "metadadosEstacoes"]),

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
    this.$watch(
      "darkMode",
      (isDark) => {
        this.$refs.graficoTemporal.updateOptions({
          theme: {
            mode: isDark ? "dark" : "light",
          },
          grid: {
            row: {
              colors: isDark
                ? ["#333", "transparent"]
                : ["#e5e5e5", "transparent"],
            },
          },
        });
      },
      {
        immediate: true,
      }
    );
  },

  methods: {
    ...mapActions(useObservationStore, [
      "getTodayObservations",
      "getSpecificDayObservations",
      "getPeriodDailyObservations",
      "setStartDate",
      "setEndDate",
      "calcularMetadados",
    ]),

    async obterCalcularEAtualizar() {
      this.carregando = true;

      try {
        await this.filtrarDadosPeriodo();

        this.calcularMetadados();
        this.calcularMaximosGlobais();
        this.$refs.graficoTemperatura.atualizar();
        this.$refs.graficoPrecipitacao.atualizar();
        this.atualizarGraficoTemporal();
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

    calcularMaximosGlobais() {
      this.maxima = 0;
      this.minima = 0;
      this.ventoMaximo = 0;
      this.precipitacaoMaxima = 0;

      this.metadadosEstacoes.forEach((metadadosEstacao) => {
        const { maxima, minima, ventoMaximo, precipitacaoMaxima } =
          metadadosEstacao;

        if (maxima > this.maxima) {
          this.maxima = maxima;
        }
        if (this.minima === 0 || (minima < this.minima && minima != 0)) {
          this.minima = minima;
        }
        if (ventoMaximo > this.ventoMaximo) {
          this.ventoMaximo = ventoMaximo;
        }
        if (precipitacaoMaxima > this.precipitacaoMaxima) {
          this.precipitacaoMaxima = precipitacaoMaxima;
        }
      });

      for (const obs of this.observations) {
        if (obs.metric.tempHigh == this.maxima) {
          this.dadosMaxima = obs;
        }
        if (obs.metric.tempLow == this.minima) {
          this.dadosMinima = obs;
        }
        if (obs.metric.windgustHigh == this.ventoMaximo) {
          this.dadosVentoMaximo = obs;
        }
        if (obs.metric.precipTotal == this.precipitacaoMaxima) {
          this.dadosPrecipitacaoMaxima = obs;
        }
      }
    },

    atualizarGraficoTemporal() {
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

    formatarDataCard({ obsTimeLocal }) {
      return new Date(obsTimeLocal).toLocaleDateString();
    },

    formatarTituloCard(dados) {
      const idEstacao = dados.stationID;
      return `Em ${this.estacoes[idEstacao]?.NOME} (${idEstacao})`;
    },
  },
});
</script>
