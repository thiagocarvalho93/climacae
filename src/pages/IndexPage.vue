<template>
  <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
    <q-card flat class="q-pa-md q-mb-md fade">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-4 col-md-2 fade">
          <q-select dense outlined v-model="periodoSelecionado" :options="opcoesPeriodos" label="Período" />
        </div>
        <div v-if="periodoSelecionado === periodos.DIA_ESPECIFICO" class="col-4 col-sm-2 col-md-1 fade">
          <q-select dense outlined v-model="diaSelecionado" :options="opcoesDias" label="Dia" />
        </div>
        <div v-if="periodoSelecionado === periodos.MES_ESPECIFICO ||
          periodoSelecionado === periodos.DIA_ESPECIFICO
          " :class="(periodoSelecionado === periodos.DIA_ESPECIFICO
    ? 'col-4 '
    : 'col-6 ') + 'col-sm-2 col-md-1 fade'
    ">
          <q-select dense outlined v-model="mesSelecionado" :options="opcoesMeses" label="Mês" />
        </div>
        <div v-if="periodoSelecionado === periodos.MES_ESPECIFICO ||
          periodoSelecionado === periodos.DIA_ESPECIFICO
          " :class="(periodoSelecionado === periodos.DIA_ESPECIFICO
    ? 'col-4 '
    : 'col-6 ') + 'col-sm-2 col-md-1 fade'
    ">
          <q-select dense outlined v-model="anoSelecionado" :options="opcoesAnos" label="Ano" />
        </div>
        <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
          <q-btn push @click="obterCalcularEAtualizar" style="width: 100%" :loading="carregando" color="primary">Filtrar
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Carregando
            </template>
          </q-btn>
        </div>
      </div>
    </q-card>
    <div class="row q-col-gutter-md fade">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat dark @click="mostrarInformacoesCard[0] = !mostrarInformacoesCard[0]" class="cursor-pointer maxima">
          <q-card-section class="grow" v-if="mostrarInformacoesCard[0]">
            <q-item>
              <q-item-section>
                <q-item-label> MÁXIMA </q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ maxima }}°C
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="thermostat" />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="grow" v-else>
            <q-item>
              <q-item-section>
                <q-item-label>
                  Em {{ estacoes[dadosMaxima.stationID].NOME }} ({{
                    dadosMaxima.stationID
                  }})</q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ new Date(dadosMaxima.obsTimeLocal).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-red"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat dark @click="mostrarInformacoesCard[1] = !mostrarInformacoesCard[1]" class="cursor-pointer minima">
          <q-card-section class="grow" v-if="mostrarInformacoesCard[1]">
            <q-item>
              <q-item-section>
                <q-item-label> MÍNIMA </q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ minima }}°C
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="thermostat" />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="grow" v-else>
            <q-item>
              <q-item-section>
                <q-item-label>
                  Em {{ estacoes[dadosMinima.stationID].NOME }} ({{
                    dadosMinima.stationID
                  }})</q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ new Date(dadosMinima.obsTimeLocal).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-primary"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat dark @click="mostrarInformacoesCard[2] = !mostrarInformacoesCard[2]" class="cursor-pointer vento">
          <q-card-section class="grow" v-if="mostrarInformacoesCard[2]">
            <q-item>
              <q-item-section>
                <q-item-label> VENTO MÁXIMO </q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ ventoMaximo }}
                  km/h
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="wind_power" />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="grow" v-else>
            <q-item>
              <q-item-section>
                <q-item-label>
                  Em {{ estacoes[dadosVentoMaximo.stationID].NOME }} ({{
                    dadosVentoMaximo.stationID
                  }})</q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{
                    new Date(dadosVentoMaximo.obsTimeLocal).toLocaleDateString()
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat dark @click="mostrarInformacoesCard[3] = !mostrarInformacoesCard[3]"
          class="cursor-pointer precipitacao">
          <q-card-section class="grow" v-if="mostrarInformacoesCard[3]">
            <q-item>
              <q-item-section>
                <q-item-label> PRECIPITAÇÃO MÁXIMA </q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{ precipitacaoMaxima }}mm
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="ion-rainy" />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="grow" v-else>
            <q-item>
              <q-item-section>
                <q-item-label>
                  Em {{ estacoes[dadosPrecipitacaoMaxima.stationID].NOME }} ({{
                    dadosPrecipitacaoMaxima.stationID
                  }})</q-item-label>
                <q-item-label class="text-bold text-h6">
                  {{
                    new Date(
                      dadosPrecipitacaoMaxima.obsTimeLocal
                    ).toLocaleDateString()
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-indigo"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-md-4 flex">
        <q-card flat class="full-width">
          <q-card-section class="text-h6">
            Agora ({{ ultimaAtualizacao }})
          </q-card-section>
          <q-card-section>
            <q-carousel v-model="slide" transition-duration="600" transition-prev="slide-right"
              transition-next="slide-left" swipeable animated :control-color="darkMode ? 'white' : 'primary'" padding
              arrows infinite height="265px" :autoplay="autoplayCarousel" class="bg-transparent"
              @mouseenter="autoplay = false" @mouseleave="autoplay = true">
              <q-carousel-slide v-for="dados in realTimeObservations" :key="dados.stationID"
                :name="estacoes[dados.stationID].NOME" class="column no-wrap flex-center">
                <div class="q-mt-md text-center text-h6">
                  {{ estacoes[dados.stationID].NOME }}
                </div>
                <div class="justify-start">
                  <div class="q-mt-md text-h6 text-start">
                    <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="ion-thermometer" />
                    {{ dados.metric.temp }}°C
                  </div>
                  <div class="q-mt-md text-h6 text-start">
                    <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="ion-rainy" />
                    {{ dados.metric.precipRate }}mm/h
                  </div>
                </div>
                <div class="q-mt-md text-h6 text-start">
                  <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="md" name="water_drop" />
                  {{ dados.humidity }}%
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card-section>
          <q-inner-loading :showing="carregandoTempoReal" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-md-8 flex">
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Máximas e mínimas </q-card-section>
          <q-card-section>
            <apexchart type="bar" height="250" :options="chartTemperaturaOptions" :series="seriesTemperatura"
              ref="graficoColunaTemperatura"></apexchart>
          </q-card-section>
          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-5 flex">
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Precipitação </q-card-section>
          <q-card-section>
            <apexchart type="bar" height="350" :options="chartPrecipitacaoOptions" :series="seriesPrecipitacao"
              ref="graficoPrecipitacao"></apexchart>
          </q-card-section>
          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-7 flex">
        <q-card flat class="full-width">
          <q-card-section class="text-h6">
            <div class="row">
              <div class="col-12 col-sm-8 col-md-10">
                <span>Séries temporais</span>
              </div>
              <div class="col-12 col-sm-4 col-md-2">
                <q-select dense v-model="estacaoSelecionada" :options="nomesEstacoes" outlined hide-bottom-space
                  input-style="{ background-color: red }" option-label="NOME" label="Estação" />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <apexchart height="350" :options="chartSerieTemporalOptions" :series="seriesTemporal" ref="graficoTemporal" />
          </q-card-section>
          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12">
        <q-table :class="darkMode ? 'my-sticky-header-table-dark' : 'my-sticky-header-table'
          " flat column-sort-order="ad" title="Dados das estações" :rows="observations" :columns="colunasTabela"
          :pagination="pagination" :filter="filter" :rows-per-page-options="[6, 12, 24, 48, 96]" row-key="name"
          :loading="carregando">
          <template v-slot:top-right>
            <q-input outlined dense debounce="700" v-model="filter" placeholder="Pesquisar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn push color="primary" class="q-ml-md q-pa-sm">
              <q-icon class="icon" size="sm" name="download" />
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section @click="donwloadCsv">.csv</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>

          <template #body-cell="props">
            <q-td :props="props" :class="striped(props)">
              <span>{{ props.value }}</span>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
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
  OPCOES_MESES,
  OPCOES_DIAS,
  OPCOES_ANOS,
} from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import Observation from "src/models/observation-model";
import Metric from "src/models/metric-model";
import { mapActions, mapState } from "pinia";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "IndexPage",

  components: {},

  computed: {
    ...mapState(useObservationStore, ['observations', 'realTimeObservations']),

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
      return Object.keys(STATIONS)
    },

    periodos() {
      return PERIODOS;
    },

    opcoesPeriodos() {
      return Object.values(PERIODOS);
    },

    opcoesDias() {
      return OPCOES_DIAS;
    },

    opcoesMeses() {
      return OPCOES_MESES;
    },

    opcoesAnos() {
      return OPCOES_ANOS;
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

  watch: {
    darkMode(newThemeDark, oldThemeDark) {
      this.$refs.graficoColunaTemperatura.updateOptions({
        theme: {
          mode: newThemeDark ? "dark" : "light",
        },
      });

      this.$refs.graficoPrecipitacao.updateOptions({
        theme: {
          mode: newThemeDark ? "dark" : "light",
        },
      });

      this.$refs.graficoTemporal.updateOptions({
        theme: {
          mode: newThemeDark ? "dark" : "light",
        },
      });
    },
  },

  data() {
    return {
      //estados
      carregando: true,
      carregandoTempoReal: false,
      mostrarInformacoesCard: [true, true, true, true],
      autoplayCarousel: true,
      //inputs
      slide: STATIONS[Object.keys(STATIONS)[0]].NOME,
      estacaoSelecionada: Object.values(STATIONS)[0],
      periodoSelecionado: PERIODOS.HOJE,
      diaSelecionado: new Date().getDate(),
      mesSelecionado: new Date().getMonth() + 1,
      anoSelecionado: new Date().getFullYear(),
      dataInicial: new Date(),
      dataFinal: new Date(),
      filter: "",
      //outputs
      metadadosEstacoes: [],
      ultimaAtualizacao: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
      //tabela
      pagination: {
        rowsPerPage: 12,
      },
    };
  },

  async created() {
    await this.obterCalcularEAtualizar();
    await this.getRealTimeObservations(this.idsEstacoes);
    this.atualizarDadosAtuais();
  },

  beforeUnmount() {
    clearInterval(this.atualizarDadosAtuais);
  },

  methods: {
    ...mapActions(useObservationStore, ['getTodayObservations', 'getSpecificDayObservations', 'getPeriodDailyObservations', 'reverseObservations', 'getRealTimeObservations']),

    striped(props) {
      if (props.rowIndex % 2 != 0) {
        return 'dark-grey'
      }
    },
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
        this.reverseObservations();
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
            handler: () => { },
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
            handler: () => { },
          },
        ],
      });
    },

    async filtrarDadosPeriodo() {
      switch (this.periodoSelecionado) {
        case PERIODOS.HOJE:
          this.setDates(new Date(), new Date());
          await this.getTodayObservations(this.idsEstacoes);
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          const daysAgo = this.periodoSelecionado === PERIODOS.ULTIMOS_SETE_DIAS ? 7 : 30;
          this.setDates(new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000), new Date());
          await this.getPeriodDailyObservations(this.idsEstacoes, this.dataInicial, this.dataFinal);
          break;
        case PERIODOS.MES_ESPECIFICO:
          await this.filtrarMesEspecifico(this.mesSelecionado, this.anoSelecionado);
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
      const { dataInicial, dataFinal } = dataUtils.definirDataInicialEFinalMes(mes, ano);
      this.setDates(dataInicial, dataFinal);

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

    calcularMetadados() {
      this.metadadosEstacoes = [];

      // TODO fazer o método calcularMaximosGlobais nesse mesmo loop
      this.observations.forEach((obs) => {
        const obsModel = new Observation(obs);
        const { metric, stationID } = obsModel;
        const { tempHigh, tempLow, windgustHigh, precipRate, precipTotal } =
          new Metric(metric);

        let indiceMetadadosEstacao = this.metadadosEstacoes.findIndex(
          (x) => x.id === STATIONS[stationID].NOME
        );

        if (indiceMetadadosEstacao === -1) {
          this.metadadosEstacoes.push({
            id: STATIONS[stationID].NOME,
            minima: tempLow,
            maxima: tempHigh,
            ventoMaximo: windgustHigh,
            precipitacaoMaxima: precipRate,
            precipitacaoAcumulada: precipTotal,
          });
        } else {
          const {
            maxima,
            minima,
            ventoMaximo,
            precipitacaoMaxima,
            precipitacaoAcumulada,
          } = this.metadadosEstacoes[indiceMetadadosEstacao];

          this.metadadosEstacoes[indiceMetadadosEstacao] = {
            id: STATIONS[stationID].NOME,
            maxima: Math.max(tempHigh, maxima),
            minima: Math.min(tempLow, minima),
            ventoMaximo: Math.max(windgustHigh, ventoMaximo),
            precipitacaoMaxima: Math.max(precipTotal, precipitacaoMaxima),
            precipitacaoAcumulada: precipitacaoAcumulada + precipTotal,
          };
        }
      });
    },

    calcularMaximosGlobais() {
      this.maxima = 0;
      this.minima = 0;
      this.ventoMaximo = 0;
      this.precipitacaoMaxima = 0;

      this.metadadosEstacoes.forEach((metadadosEstacao) => {
        const {
          id,
          maxima,
          minima,
          ventoMaximo,
          precipitacaoMaxima,
          precipitacaoAcumulada,
        } = metadadosEstacao;

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

    atualizarDadosAtuais() {
      setInterval(async () => {
        this.carregandoTempoReal = true;

        await this.getRealTimeObservations(this.idsEstacoes);

        this.ultimaAtualizacao = new Date().toLocaleTimeString(
          navigator.language,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        this.carregandoTempoReal = false;
      }, 30000);
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
        precipitacaoMaxima = Math.max(...precMaximas);
        series.splice(1, 1); // Remove a série "Precipitação restante"
      } else {
        const precMaximas = data.map(
          (x) => x.precipitacaoMaxima + x.precipitacaoRestante
        );
        precipitacaoMaxima = Math.max(...precMaximas);
      }

      this.$refs.graficoPrecipitacao.updateOptions({
        series: series,
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

    montarCsv() {
      let props = [
        "obsTimeLocal",
        "stationID",
        "humidityAvg",
        "humidityHigh",
        "humidityLow",
        "winddirAvg",
      ];

      let csvString = "";
      csvString += props.join(",");
      csvString += ",";
      csvString += Object.keys(new Metric()).join(",");
      csvString += "\n";

      for (const obs of this.observations) {
        csvString += props.map((prop) => obs[prop]).join(",");
        csvString += ",";
        csvString += Object.values(obs.metric).join(",");
        csvString += "\n";
      }

      return csvString;
    },

    formatarData(data) {
      const dia = new Date(data).getDate();
      const mes = new Date(data).getMonth();
      const ano = new Date(data).getFullYear();

      return `${dia}_${mes}_${ano}`;
    },

    nomePadraoCSV() {
      if (this.periodoSelecionado === PERIODOS.HOJE) {
        return `${this.formatarData(this.dataInicial)}.csv`;
      }
      return `${this.formatarData(this.dataInicial)}-${this.formatarData(
        this.dataFinal
      )}.csv`;
    },

    async donwloadCsv() {
      const opts = {
        types: [
          {
            description: "CSV",
            accept: { "text/csv": [".csv"] },
          },
        ],
        suggestedName: this.nomePadraoCSV(),
      };

      try {
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();

        let csv = this.montarCsv();

        await writable.write(csv);
        await writable.close();

        const mensagem = `Arquivo ${handle.name} salvo com sucesso!`;
        this.mensagemSucesso(mensagem);
      } catch (err) {
        if (err.message === "The user aborted a request.") return; // cancelar
        const mensagem = `${err.message}`;
        this.mensagemErro(mensagem);
      }
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
  --scrollbar-thumb-dark          : #CCC
  --scrollbar-thumb-hover-dark    : rgb(33,118,210)

.maxima
  height: 90px
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0s
  background-image: linear-gradient(to right,$red-6, $red-8)

.minima
  height: 90px
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0.2s
  background-image: linear-gradient(to right,$blue-6, $blue-8)

.vento
  height: 90px
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0.4s
  background-image: linear-gradient(to right,$teal-6, $teal-8)

.precipitacao
  height: 90px
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0.6s
  background-image: linear-gradient(to right,$indigo-6, $indigo-8)

.dark-grey
  background-image: linear-gradient(to right,#eef, #eef)

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

.my-sticky-header-table
  /* height or max-height is important */
  height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #FFF

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.my-sticky-header-table-dark
  @extend .my-sticky-header-table

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $dark
</style>
