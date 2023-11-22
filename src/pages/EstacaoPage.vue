<template>
  <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
    <q-card flat class="q-pa-md q-mb-md fade">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-4 col-md-2 fade">
          <q-select
            dense
            v-model="estacaoSelecionada"
            :options="nomesEstacoes"
            outlined
            hide-bottom-space
            input-style="{ background-color: red }"
            option-label="NOME"
            label="Estação"
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2 fade">
          <q-select
            dense
            outlined
            v-model="periodoSelecionado"
            :options="opcoesPeriodos"
            label="Período"
          />
        </div>
        <div
          v-if="periodoSelecionado === periodos.DIA_ESPECIFICO"
          class="col-4 col-sm-2 col-md-1 fade"
        >
          <q-select
            dense
            outlined
            v-model="diaSelecionado"
            :options="opcoesDias"
            label="Dia"
          />
        </div>
        <div
          v-if="
            periodoSelecionado === periodos.MES_ESPECIFICO ||
            periodoSelecionado === periodos.DIA_ESPECIFICO
          "
          :class="
            (periodoSelecionado === periodos.DIA_ESPECIFICO
              ? 'col-4 '
              : 'col-6 ') + 'col-sm-2 col-md-1 fade'
          "
        >
          <q-select
            dense
            outlined
            v-model="mesSelecionado"
            :options="opcoesMeses"
            label="Mês"
          />
        </div>
        <div
          v-if="
            periodoSelecionado === periodos.MES_ESPECIFICO ||
            periodoSelecionado === periodos.DIA_ESPECIFICO
          "
          :class="
            (periodoSelecionado === periodos.DIA_ESPECIFICO
              ? 'col-4 '
              : 'col-6 ') + 'col-sm-2 col-md-1 fade'
          "
        >
          <q-select
            dense
            outlined
            v-model="anoSelecionado"
            :options="opcoesAnos"
            label="Ano"
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
          <q-btn
            push
            @click="obterDadosEstacao"
            style="width: 100%"
            :loading="carregando"
            color="primary"
            >Filtrar
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Carregando
            </template>
          </q-btn>
        </div>
      </div>
    </q-card>

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
          <q-card-section class="text-h6"> Vento </q-card-section>
          <q-card-section>
            <apexchart
              height="250"
              :options="chartSerieTemporalOptions"
              :series="seriesVento"
              ref="graficoTemporalVento"
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
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  STATIONS,
  PERIODOS,
  OPCOES_DIAS,
  OPCOES_MESES,
  OPCOES_ANOS,
  CHART_SERIE_TEMPORAL_OPTIONS,
} from "../constants/constants";
import weatherApi from "src/api/weather-api";
import Observation from "src/models/observation-model";
import dataUtils from "src/utils/data-utils";

export default defineComponent({
  name: "EstacaoPage",
  components: {},

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
          this.dataInicial = new Date(Date.now());
          this.dataFinal = new Date(Date.now());
          await this.obterObservacoesDiaAtual();
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
          this.dataInicial = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          this.dataFinal = new Date(Date.now());
          await this.obterObservacoesDiariasPeriodo(
            this.dataInicial,
            this.dataFinal
          );
          break;
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          this.dataInicial = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          this.dataFinal = new Date(Date.now());
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

    async filtrarMesEspecifico() {
      const hoje = new Date();
      let isFuturo =
        this.mesSelecionado > hoje.getMonth() + 1 &&
        this.anoSelecionado >= hoje.getFullYear();

      if (isFuturo) throw new Error("Não é possivel obter dados do futuro!");

      this.dataInicial = new Date(
        this.anoSelecionado,
        this.mesSelecionado - 1,
        1
      );

      let isEsseMes =
        this.mesSelecionado == hoje.getMonth() + 1 &&
        this.anoSelecionado == hoje.getFullYear();

      if (isEsseMes) {
        this.dataFinal = hoje;
      } else {
        this.dataFinal = new Date(this.anoSelecionado, this.mesSelecionado, 0);
      }

      await this.obterObservacoesDiariasPeriodo(
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

      await this.obterObservacoesDiaEspecifico(this.dataInicial);
    },

    async obterObservacoesDiaAtual() {
      const station = this.estacaoSelecionada.ID;

      try {
        const response = await weatherApi.obterObservacoesDiaAtualEstacao(
          station
        );

        this.observacoes = response.observations
          ? response.observations.map((res) => new Observation(res))
          : [];
      } catch (error) {
        throw error;
      }
    },

    async obterObservacoesDiariasPeriodo(dataInicial, dataFinal) {
      const station = this.estacaoSelecionada.ID;
      const dataInicialFormatada = this.formatarDataParaQuery(dataInicial);
      const dataFinalFormatada = this.formatarDataParaQuery(dataFinal);

      try {
        const response = await weatherApi.obterObservacoesDiariasPeriodo(
          station,
          dataInicialFormatada,
          dataFinalFormatada
        );

        this.observacoes = response.observations
          ? response.observations.map((res) => new Observation(res))
          : [];
      } catch (error) {
        throw error;
      }
    },

    async obterObservacoesDiaEspecifico(data) {
      const station = this.estacaoSelecionada.ID;
      const dataFormatada = this.formatarDataParaQuery(data);

      try {
        const response = await weatherApi.obterTodasObservacoesDia(
          station,
          dataFormatada
        );

        this.observacoes = response.observations
          ? response.observations.map((res) => new Observation(res))
          : [];
      } catch (error) {
        throw error;
      }
    },

    formatarDataParaQuery(data) {
      return `${data.getFullYear()}${data.getMonth() + 1 < 10 ? "0" : ""}${
        data.getMonth() + 1
      }${data.getDate() < 10 ? "0" : ""}${data.getDate()}`;
    },

    atualizarGraficoTemporalTemperatura() {
      const temperaturas = ["tempAvg", "tempHigh", "tempLow"];
      const dados = temperaturas.map((x) => {
        return {
          name: x,
          data: this.observacoes.map((obs) => [
            new Date(obs.obsTimeLocal),
            obs.metric[x],
          ]),
        };
      });

      this.$refs.graficoTemporalTemperatura.updateSeries(dados);
    },

    atualizarGraficoTemporalPressao() {
      const temperaturas = ["pressureMin", "pressureMax"];
      const dados = temperaturas.map((x) => {
        return {
          name: x,
          data: this.observacoes.map((obs) => [
            new Date(obs.obsTimeLocal),
            obs.metric[x],
          ]),
        };
      });

      this.$refs.graficoTemporalPressao.updateOptions({
        series: dados,
        yaxis: {},
      });
    },

    atualizarGraficoTemporalPrecipitacao() {
      const temperaturas = ["precipRate", "precipTotal"];
      const dados = temperaturas.map((x) => {
        return {
          name: x,
          data: this.observacoes.map((obs) => [
            new Date(obs.obsTimeLocal),
            obs.metric[x],
          ]),
        };
      });

      this.$refs.graficoTemporalPrecipitacao.updateOptions({
        series: dados,
        yaxis: {},
      });
    },

    atualizarGraficoTemporalVento() {
      const temperaturas = ["windspeedAvg", "windspeedHigh", "windspeedLow"];
      const dados = temperaturas.map((x) => {
        return {
          name: x,
          data: this.observacoes.map((obs) => [
            new Date(obs.obsTimeLocal),
            obs.metric[x],
          ]),
        };
      });

      this.$refs.graficoTemporalVento.updateOptions({
        series: dados,
        yaxis: {},
      });
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
