<template>
  <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
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
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Temperatura </q-card-section>
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
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Pressão </q-card-section>
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
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Precipitação </q-card-section>
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
        <q-card flat class="full-width">
          <q-card-section class="text-h6"> Velocidade do vento </q-card-section>
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
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  STATIONS,
  PERIODOS,
  CHART_SERIE_TEMPORAL_OPTIONS,
} from "../constants/constants";
import weatherApi from "src/api/weather-api";
import Observation from "src/models/observation-model";
import dataUtils from "src/utils/data-utils";
import SecaoFiltros from "src/components/SecaoFiltros.vue";

export default defineComponent({
  name: "EstacaoPage",
  components: { SecaoFiltros },

  computed: {
    darkMode() {
      return this.$q.dark.isActive;
    },
    estacoes() {
      return STATIONS;
    },
    nomesEstacoes() {
      return Object.values(STATIONS);
    },
  },

  data() {
    return {
      carregando: false,
      dataInicial: new Date(),
      dataFinal: new Date(),
      //inputs
      estacaoSelecionada: Object.values(STATIONS)[0],
      periodoSelecionado: PERIODOS.HOJE,
      diaSelecionado: new Date().getDate(),
      mesSelecionado: new Date().getMonth() + 1,
      anoSelecionado: new Date().getFullYear(),
      //outputs
      observacoes: [],

      chartSerieTemporalOptions: CHART_SERIE_TEMPORAL_OPTIONS,
      chartTemperaturaOptions: CHART_SERIE_TEMPORAL_OPTIONS,
      seriesTemperatura: [],
      seriesPressao: [],
      seriesPrecipitacao: [],
      seriesVento: [],
    };
  },

  created() {
    this.obterDadosEstacao();
  },

  methods: {
    async obterDadosEstacao() {
      this.carregando = true;
      try {
        await this.obterDadosPeriodo();
        this.atualizarGraficoTemporalTemperatura();
        this.atualizarGraficoTemporalPressao();
        this.atualizarGraficoTemporalPrecipitacao();
        this.atualizarGraficoTemporalVento();
      } catch (error) {
        const mensagem = (error && error.message) || "Erro ao obter os dados.";
        this.mensagemErro(mensagem);
      } finally {
        this.observacoes = this.observacoes.reverse();
        this.carregando = false;
      }
    },

    async obterDadosPeriodo() {
      switch (this.periodoSelecionado) {
        case PERIODOS.HOJE:
          this.setDates(new Date(), new Date());
          await this.obterObservacoesDiaAtual();
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          const daysAgo =
            this.periodoSelecionado === PERIODOS.ULTIMOS_SETE_DIAS ? 7 : 30;
          this.setDates(
            new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            new Date()
          );
          await this.obterObservacoesDiariasPeriodo(
            this.dataInicial,
            this.dataFinal
          );
          break;
        case PERIODOS.MES_ESPECIFICO:
          await this.filtrarMesEspecifico();
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

    async filtrarMesEspecifico() {
      const { dataFinal, dataInicial } = dataUtils.definirDataInicialEFinalMes(
        this.mesSelecionado,
        this.anoSelecionado
      );

      await this.obterObservacoesDiariasPeriodo(dataInicial, dataFinal);
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

      await this.obterObservacoesDiaEspecifico(this.dataInicial);
    },

    async obterObservacoesDiaAtual() {
      const station = this.estacaoSelecionada.ID;

      const response = await weatherApi.obterObservacoesDiaAtualEstacao(
        station
      );

      this.observacoes = response.observations
        ? response.observations.map((res) => new Observation(res))
        : [];
    },

    async obterObservacoesDiariasPeriodo(dataInicial, dataFinal) {
      const station = this.estacaoSelecionada.ID;
      const dataInicialFormatada = this.formatarDataParaQuery(dataInicial);
      const dataFinalFormatada = this.formatarDataParaQuery(dataFinal);

      const response = await weatherApi.obterObservacoesDiariasPeriodo(
        station,
        dataInicialFormatada,
        dataFinalFormatada
      );

      this.observacoes = response.observations
        ? response.observations.map((res) => new Observation(res))
        : [];
    },

    async obterObservacoesDiaEspecifico(data) {
      const station = this.estacaoSelecionada.ID;
      const dataFormatada = this.formatarDataParaQuery(data);

      const response = await weatherApi.obterTodasObservacoesDia(
        station,
        dataFormatada
      );

      this.observacoes = response.observations
        ? response.observations.map((res) => new Observation(res))
        : [];
    },

    formatarDataParaQuery(data) {
      return `${data.getFullYear()}${data.getMonth() + 1 < 10 ? "0" : ""}${
        data.getMonth() + 1
      }${data.getDate() < 10 ? "0" : ""}${data.getDate()}`;
    },

    atualizarGraficoTemporal(chartRef, seriesMap, colors) {
      const dados = Object.keys(seriesMap).map((serie) => {
        const name = seriesMap[serie].desc;

        return {
          name,
          data: this.observacoes.map((obs) => [
            dataUtils.subtrairHoras(new Date(obs.obsTimeLocal), 3),
            obs.metric[serie],
          ]),
        };
      });

      chartRef.updateOptions({
        series: dados,
        yaxis: {},
        colors,
      });
    },

    atualizarGraficoTemporalTemperatura() {
      const tempMap = {
        tempAvg: { desc: "Média", color: "yellow" },
        tempHigh: { desc: "Máxima", color: "red" },
        tempLow: { desc: "Mínima", color: "blue" },
      };

      this.atualizarGraficoTemporal(
        this.$refs.graficoTemporalTemperatura,
        tempMap,
        ["#FFD700", "#FF5733", "#6495ED"]
      );
    },

    atualizarGraficoTemporalPressao() {
      const pressurePropsMap = {
        pressureMin: { desc: "Mínima", color: "blue" },
        pressureMax: { desc: "Máxima", color: "red" },
      };

      this.atualizarGraficoTemporal(
        this.$refs.graficoTemporalPressao,
        pressurePropsMap,
        ["#6495ED", "#FF5733"]
      );
    },

    atualizarGraficoTemporalPrecipitacao() {
      const precipPropsMap = {
        precipRate: { desc: "Taxa", color: "yellow" },
        precipTotal: { desc: "Total", color: "blue" },
      };

      this.atualizarGraficoTemporal(
        this.$refs.graficoTemporalPrecipitacao,
        precipPropsMap,
        ["#FFD700", "#6495ED"]
      );
    },

    atualizarGraficoTemporalVento() {
      const windPropsMap = {
        windspeedAvg: { desc: "Média", color: "yellow" },
        windspeedHigh: { desc: "Máxima", color: "red" },
        windspeedLow: { desc: "Mínima", color: "blue" },
      };
      colors:;

      this.atualizarGraficoTemporal(
        this.$refs.graficoTemporalVento,
        windPropsMap,
        ["#FFD700", "#FF5733", "#6495ED"]
      );
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
  },
});
</script>
