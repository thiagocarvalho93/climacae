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
    <div class="col-12 col-md-4 flex">
      <RealTimeObservationsCarousel
        :real-time-observations="realTimeObservations"
        :estacoes="estacoes"
        :dark-mode="darkMode"
      />
    </div>

    <!-- Gráficos -->
    <div class="col-12 col-md-8 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6"> Máximas e mínimas </q-card-section>
        <q-card-section>
          <apexchart
            type="bar"
            height="250"
            :options="chartTemperaturaOptions"
            :series="seriesTemperatura"
            ref="graficoColunaTemperatura"
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

    <div class="col-12 col-sm-5 flex">
      <q-card flat bordered class="full-width">
        <q-card-section class="text-h6"> Precipitação </q-card-section>
        <q-card-section>
          <apexchart
            type="bar"
            height="350"
            :options="chartPrecipitacaoOptions"
            :series="seriesPrecipitacao"
            ref="graficoPrecipitacao"
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
  CORES,
  PERIODOS,
  CHART_TEMPERATURA_OPTIONS,
  CHART_PRECIPITACAO_OPTIONS,
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

export default defineComponent({
  name: "IndexPage",

  components: {
    RealTimeObservationsCarousel,
    InformacaoCard,
    TabelaObservacoes,
    SecaoFiltros,
  },

  computed: {
    ...mapState(useObservationStore, [
      "observations",
      "realTimeObservations",
      "metadadosEstacoes",
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

    chartTemperaturaOptions() {
      return CHART_TEMPERATURA_OPTIONS;
    },

    chartPrecipitacaoOptions() {
      return CHART_PRECIPITACAO_OPTIONS;
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
      seriesTemperatura: [],
      seriesPrecipitacao: [],
      seriesTemporal: [],
    };
  },

  async created() {
    await this.obterCalcularEAtualizar();
    await this.getRealTimeObservations(this.idsEstacoes);
    this.$watch(
      "darkMode",
      (isDark) => {
        this.$refs.graficoColunaTemperatura.updateOptions({
          theme: {
            mode: isDark ? "dark" : "light",
          },
        });

        this.$refs.graficoPrecipitacao.updateOptions({
          theme: {
            mode: isDark ? "dark" : "light",
          },
        });

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
      "getRealTimeObservations",
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
        this.atualizarGraficoTemperatura();
        this.atualizarGraficoPrecipitacao();
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

    atualizarGraficoTemperatura() {
      const dadosFiltrados = this.metadadosEstacoes.filter(
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
          min: this.minima * 0.8,
          tickAmount: 5,
        },
      });
    },

    atualizarGraficoPrecipitacao() {
      const dadosFiltrados = this.metadadosEstacoes.filter(
        (x) =>
          x.precipitacaoMaxima !== (-Infinity || Infinity) &&
          x.precipitacaoAcumulada !== (-Infinity || Infinity)
      );

      const data = dadosFiltrados.map((x) => ({
        name: x.NOME,
        precipitacaoMaxima: x.precipitacaoMaxima,
        precipitacaoRestante: x.precipitacaoAcumulada - x.precipitacaoMaxima,
      }));

      const series = [
        {
          name: "Máxima em 24h",
          data: data.map((x) => x.precipitacaoMaxima),
          color: CORES.INDIGO_ESCURO,
        },
        {
          name: "Precipitação restante",
          data: data.map((x) => x.precipitacaoRestante),
          color: CORES.INDIGO,
        },
      ];

      let precipitacaoMaxima = 0;
      let isDiario =
        this.periodoSelecionado === this.periodos.DIA_ESPECIFICO ||
        this.periodoSelecionado === this.periodos.HOJE;

      if (isDiario) {
        const precMaximas = data.map((x) => x.precipitacaoMaxima);
        precipitacaoMaxima = Math.max(...precMaximas).toFixed(2);
        series.splice(1, 1); // Remove a série "Precipitação restante"
      } else {
        const precMaximas = data.map(
          (x) => x.precipitacaoMaxima + x.precipitacaoRestante
        );
        precipitacaoMaxima = Math.max(...precMaximas);
      }

      this.$refs.graficoPrecipitacao.updateOptions({
        series,
        xaxis: {
          categories: dadosFiltrados.map((x) =>
            x.id.length > 15 ? `${x.id.substring(0, 15)}...` : x.id
          ),
        },
        yaxis: {
          max: precipitacaoMaxima * 1.4,
          tickAmount: 5,
        },
      });
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

<style lang="sass">
\:root
  --scrollbar-width-height        : 10px
  --scrollbar-track               : #FFF
  --scrollbar-thumb               : rgb(204,231,255)
  --scrollbar-thumb-hover         : rgb(33,118,210)
  --scrollbar-track-dark          : $dark
  --scrollbar-thumb-dark          : #EEE
  --scrollbar-thumb-hover-dark    : rgb(33,118,210)

::-webkit-scrollbar
  width: var(--scrollbar-width-height)
  height: var(--scrollbar-width-height)

// the track (progress bar) of the scrollbar
::-webkit-scrollbar-track
  // border-top: var(--markdown-border)
  background: var(--scrollbar-track-dark)
  box-shadow: inset 0 0 4px var(--scrollbar-track-dark)

// the bottom corner of the scrollbar, where both horizontal and vertical scrollbars meet
::-webkit-scrollbar-corner
  background: var(--scrollbar-track-dark)

// the draggable scrolling handle
::-webkit-scrollbar-thumb
  background: var(--scrollbar-thumb-dark)
  border-radius: 5px

  &:hover
    background: var(--scrollbar-thumb-hover-dark)
</style>
