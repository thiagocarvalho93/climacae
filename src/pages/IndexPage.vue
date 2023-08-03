<template>
  <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
    <q-card flat class="q-pa-md q-mb-md fade">
      <div class="row q-col-gutter-md">
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
            @click="obterCalcularEAtualizar"
            style="width: 100%"
            :loading="carregando"
            color="primary"
            >Filtrar
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Loading
            </template>
          </q-btn>
        </div>
      </div>
    </q-card>
    <div class="row q-col-gutter-md fade">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          dark
          @click="mostrarInformacoesCard[0] = !mostrarInformacoesCard[0]"
          class="cursor-pointer maxima"
        >
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
                  }})</q-item-label
                >
                <q-item-label class="text-bold text-h6">
                  {{ new Date(dadosMaxima.obsTimeLocal).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading
            :showing="carregando"
            label="Aguarde..."
            label-class="text-red"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          dark
          @click="mostrarInformacoesCard[1] = !mostrarInformacoesCard[1]"
          class="cursor-pointer minima"
        >
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
                  }})</q-item-label
                >
                <q-item-label class="text-bold text-h6">
                  {{ new Date(dadosMinima.obsTimeLocal).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading
            :showing="carregando"
            label="Aguarde..."
            label-class="text-primary"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          dark
          @click="mostrarInformacoesCard[2] = !mostrarInformacoesCard[2]"
          class="cursor-pointer vento"
        >
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
                  }})</q-item-label
                >
                <q-item-label class="text-bold text-h6">
                  {{
                    new Date(dadosVentoMaximo.obsTimeLocal).toLocaleDateString()
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading
            :showing="carregando"
            label="Aguarde..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          dark
          @click="mostrarInformacoesCard[3] = !mostrarInformacoesCard[3]"
          class="cursor-pointer precipitacao"
        >
          <q-card-section class="fade" v-if="mostrarInformacoesCard[3]">
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

          <q-card-section class="fade" v-else>
            <q-item>
              <q-item-section>
                <q-item-label>
                  Em {{ estacoes[dadosPrecipitacaoMaxima.stationID].NOME }} ({{
                    dadosPrecipitacaoMaxima.stationID
                  }})</q-item-label
                >
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

          <q-inner-loading
            :showing="carregando"
            label="Aguarde..."
            label-class="text-indigo"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat>
          <q-card-section class="text-h6">
            Agora ({{ atualizacao }})
          </q-card-section>
          <q-card-section>
            <q-carousel
              v-model="slide"
              transition-duration="600"
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              animated
              :control-color="darkMode ? 'white' : 'primary'"
              padding
              arrows
              infinite
              height="265px"
              :autoplay="autoplayCarousel"
              class="bg-transparent"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
            >
              <q-carousel-slide
                v-for="dados in dadosAgora"
                :key="dados.stationID"
                :name="estacoes[dados.stationID].NOME"
                class="column no-wrap flex-center"
              >
                <div class="q-mt-md text-center text-h6">
                  {{ estacoes[dados.stationID].NOME }}
                </div>
                <div class="justify-start">
                  <div class="q-mt-md text-h6 text-start">
                    <q-icon
                      class="icon"
                      :color="darkMode ? 'white' : 'primary'"
                      size="md"
                      name="ion-thermometer"
                    />
                    {{ dados.metric.temp }}°C
                  </div>
                  <div class="q-mt-md text-h6 text-start">
                    <q-icon
                      class="icon"
                      :color="darkMode ? 'white' : 'primary'"
                      size="md"
                      name="ion-rainy"
                    />
                    {{ dados.metric.precipRate }}mm/h
                  </div>
                </div>
                <div class="q-mt-md text-h6 text-start">
                  <q-icon
                    class="icon"
                    :color="darkMode ? 'white' : 'primary'"
                    size="md"
                    name="water_drop"
                  />
                  {{ dados.humidity }}%
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card-section>
          <q-inner-loading
            :showing="carregandoTempoReal"
            label="Aguarde..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat>
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

      <div class="col-12 col-sm-5">
        <q-card flat>
          <q-card-section class="text-h6"> Precipitação </q-card-section>
          <q-card-section>
            <apexchart
              type="bar"
              height="250"
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

      <div class="col-12 col-sm-7">
        <q-card flat>
          <q-card-section class="text-h6"> Séries temporais </q-card-section>
          <q-card-section>
            <apexchart
              height="250"
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

      <div class="col-12">
        <q-table
          :class="
            darkMode ? 'my-sticky-header-table-dark' : 'my-sticky-header-table'
          "
          flat
          column-sort-order="ad"
          title="Dados das estações"
          :rows="observacoes"
          :columns="columns"
          :pagination="pagination"
          :filter="filter"
          :rows-per-page-options="[6, 12, 24, 48, 96]"
          row-key="name"
          :loading="carregando"
        >
          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Pesquisar"
            >
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
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { STATIONS, CORES, PERIODOS } from "../constants/constants";
import { API_KEY } from "src/constants/secrets";
import arrayUtils from "src/utils/array-utils";
import dataUtils from "src/utils/data-utils";
import weatherApi from "src/api/weather-api";
import Observation from "src/models/observation-model";
import ObservationCurrent from "src/models/observation-current-model";

export default defineComponent({
  name: "IndexPage",

  components: {},

  computed: {
    darkMode() {
      return this.$q.dark.isActive;
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
      carregando: true,
      carregandoTempoReal: false,
      slide: STATIONS[Object.keys(STATIONS)[0]].NOME,
      mostrarInformacoesCard: [true, true, true, true],
      autoplayCarousel: true,
      cores: CORES,
      apiKey: API_KEY,
      estacoes: STATIONS,
      metadadosEstacoes: [],
      dadosAgora: [],
      dataInicial: new Date(),
      dataFinal: new Date(),
      periodos: PERIODOS,
      periodoSelecionado: PERIODOS.HOJE,
      opcoesPeriodos: Object.values(PERIODOS),
      diaSelecionado: new Date().getDate(),
      opcoesDias: arrayUtils.arrayRange(1, dataUtils.calcularDiaMesAtual(), 1),
      mesSelecionado: new Date().getMonth() + 1,
      opcoesMeses: Array.from({ length: 12 }, (_, i) => i + 1),
      opcoesAnos: arrayUtils.arrayRange(2020, new Date().getFullYear(), 1),
      anoSelecionado: new Date().getFullYear(),
      atualizacao: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      observacoes: [],
      minima: 0,
      dadosMinima: [],
      maxima: 0,
      dadosMaxima: [],
      ventoMaximo: 0,
      dadosVentoMaximo: [],
      precipitacaoMaxima: 0,
      dadosPrecipitacaoMaxima: [],
      pagination: {
        rowsPerPage: 12,
      },
      filter: "",
      columns: [
        {
          name: "data",
          required: true,
          label: "Data",
          align: "left",
          field: (row) => row.obsTimeLocal,
          format: (val) => `${new Date(val).toLocaleDateString()}`,
          sortable: true,
          style: "width: 50px",
          align: "left",
        },
        {
          name: "hora",
          required: true,
          label: "Hora",
          align: "left",
          field: (row) => row.obsTimeLocal,
          format: (val) =>
            `${new Date(val).toLocaleTimeString(navigator.language, {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          sortable: true,
          style: "width: 50px",
          align: "left",
        },
        {
          name: "idEstacao",
          align: "center",
          label: "ID estação",
          field: (row) => row.stationID,
          sortable: true,
          style: "width: 50px",
          align: "left",
        },
        {
          name: "estacao",
          align: "center",
          label: "Local",
          field: (row) => STATIONS[row.stationID].NOME,
          sortable: true,
          align: "left",
        },
        {
          name: "max",
          label: "Máxima (°C)",
          field: (row) => row.metric.tempHigh,
          sortable: true,
          align: "left",
        },
        {
          name: "min",
          label: "Mínima (°C)",
          field: (row) => row.metric.tempLow,
          sortable: true,
          align: "left",
        },
        {
          name: "humid",
          label: "Umidade (%)",
          field: (row) => row.humidityAvg,
          sortable: true,
          align: "left",
        },
        {
          name: "precipitacao",
          label: "Precipitação (mm)",
          field: (row) => row.metric.precipTotal,
          sortable: true,
          align: "left",
        },
        {
          name: "gustHigh",
          label: "Vento máximo (km/h)",
          field: (row) => row.metric.windgustHigh,
          sortable: true,
          align: "left",
        },
      ],
      seriesTemperatura: [],
      seriesPrecipitacao: [],
      seriesTemporal: [],
      chartTemperaturaOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "45%",
            borderRadius: 2,
            borderRadiusApplication: "end",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          strokeDashArray: 5,
        },
        xaxis: {
          categories: Object.keys(STATIONS),
        },
        yaxis: {
          max: 40,
          tickAmount: 5,
        },

        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(1) + "°C";
            },
          },
        },
      },
      chartPrecipitacaoOptions: {
        chart: {
          type: "bar",
          stacked: true,
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 3,
            borderRadiusWhenStacked: "last",
            borderRadiusApplication: "end",
            horizontal: true,
            stacked: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 12,
                offsetY: 6,
                style: {
                  fontSize: "12px",
                  fontWeight: 800,
                },
                formatter: function (val) {
                  return val.toFixed(1) + " mm";
                },
              },
            },
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
          strokeDashArray: 7,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: Object.keys(STATIONS),
        },
      },
      chartSerieTemporalOptions: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 3,
          curve: "smooth",
        },
        grid: {
          row: {
            opacity: 0.5,
          },
        },
        xaxis: {
          type: "datetime",
          tickAmount: 8,
        },
        yaxis: {
          min: 5,
          max: 40,
        },
      },
    };
  },

  async created() {
    await this.obterCalcularEAtualizar();
    await this.obterDadosAtuaisTodasEstacoes();
    this.atualizarDadosAtuais();
  },

  beforeUnmount() {
    clearInterval(this.atualizarDadosAtuais);
  },

  methods: {
    async obterCalcularEAtualizar() {
      this.carregando = true;

      try {
        const inicioObtencao = new Date();

        await this.filtrarDadosPeriodo();
        console.log(
          `Tempo de execução para obter dados: ${new Date() - inicioObtencao}ms`
        );

        const inicioCalculo = new Date();

        this.calcularMetadados();
        this.calcularMaximosGlobais();
        this.atualizarGraficoTemperatura();
        this.atualizarGraficoPrecipitacao();
        this.atualizarGraficoTemporal();
        console.log(
          `Tempo de execução para manipular dados: ${
            new Date() - inicioCalculo
          }ms`
        );
      } catch (error) {
        this.$q.notify({
          message: (error && error.message) || "Erro ao obter os dados.",
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
      }
      this.observacoes = this.observacoes.reverse();
      this.carregando = false;
    },

    async filtrarDadosPeriodo() {
      switch (this.periodoSelecionado) {
        case PERIODOS.HOJE:
          this.dataInicial = new Date(Date.now());
          this.dataFinal = new Date(Date.now());
          await this.obterObservacoesDiaAtualTodasEstacoes();
          break;
        case PERIODOS.ULTIMOS_SETE_DIAS:
          this.dataInicial = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          this.dataFinal = new Date(Date.now());
          await this.obterObservacoesDiariasPeriodoTodasEstacoes(
            this.dataInicial,
            this.dataFinal
          );
          break;
        case PERIODOS.ULTIMOS_TRINTA_DIAS:
          this.dataInicial = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          this.dataFinal = new Date(Date.now());
          await this.obterObservacoesDiariasPeriodoTodasEstacoes(
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

      if (
        this.mesSelecionado > hoje.getMonth() + 1 &&
        this.anoSelecionado >= hoje.getFullYear()
      ) {
        throw new Error("Não é possivel obter dados do futuro!");
      }

      this.dataInicial = new Date(
        this.anoSelecionado,
        this.mesSelecionado - 1,
        1
      );

      if (
        this.mesSelecionado == hoje.getMonth() + 1 &&
        this.anoSelecionado == hoje.getFullYear()
      ) {
        this.dataFinal = hoje;
      } else {
        this.dataFinal = new Date(this.anoSelecionado, this.mesSelecionado, 0);
      }

      await this.obterObservacoesDiariasPeriodoTodasEstacoes(
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

      await this.obterObservacoesDiaEspecificoTodasEstacoes(this.dataInicial);
    },

    formatarDataParaQuery(data) {
      return `${data.getFullYear()}${data.getMonth() + 1 < 10 ? "0" : ""}${
        data.getMonth() + 1
      }${data.getDate() < 10 ? "0" : ""}${data.getDate()}`;
    },

    async obterObservacoesDiaAtualTodasEstacoes() {
      const stations = Object.keys(STATIONS);

      try {
        const responses = await Promise.all(
          stations.map((station) =>
            weatherApi.obterObservacoesDiaAtualEstacao(station)
          )
        );

        this.observacoes = responses.flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        );
      } catch (error) {
        throw error;
      }
    },

    async obterObservacoesDiaEspecificoTodasEstacoes(data) {
      const stations = Object.keys(STATIONS);

      const dataFormatada = this.formatarDataParaQuery(data);

      try {
        const responses = await Promise.all(
          stations.map((station) =>
            weatherApi.obterTodasObservacoesDia(station, dataFormatada)
          )
        );

        this.observacoes = responses.flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        );
      } catch (error) {
        throw error;
      }
    },

    async obterObservacoesDiariasPeriodoTodasEstacoes(dataInicial, dataFinal) {
      const stations = Object.keys(STATIONS);

      const dataInicialFormatada = this.formatarDataParaQuery(dataInicial);
      const dataFinalFormatada = this.formatarDataParaQuery(dataFinal);

      try {
        const responses = await Promise.all(
          stations.map((station) =>
            weatherApi.obterObservacoesDiariasPeriodo(
              station,
              dataInicialFormatada,
              dataFinalFormatada
            )
          )
        );

        this.observacoes = responses.flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        );
      } catch (error) {
        throw error;
      }
    },

    async obterDadosAtuaisTodasEstacoes() {
      const stations = Object.keys(STATIONS);

      try {
        const responses = await Promise.all(
          stations.map((station) => weatherApi.obterDadosTempoReal(station))
        );

        this.dadosAgora = responses.flatMap((response) =>
          (response.observations || []).map((ob) => new ObservationCurrent(ob))
        );
      } catch (error) {
        throw error;
      }
    },

    calcularMetadados() {
      this.metadadosEstacoes = Object.keys(STATIONS).map((station) => {
        const observacoesEstacao = this.observacoes.filter(
          (x) => x.stationID === station
        );
        const minima = Math.min(
          ...observacoesEstacao
            .filter((x) => !!x.metric.tempLow)
            .map((x) => x.metric.tempLow)
        );
        const maxima = Math.max(
          ...observacoesEstacao
            .filter((x) => !!x.metric.tempHigh)
            .map((x) => x.metric.tempHigh)
        );
        const ventoMaximo = Math.max(
          ...observacoesEstacao
            .filter((x) => !!x.metric.windgustHigh)
            .map((x) => x.metric.windgustHigh)
        );
        const precipitacaoMaxima = Math.max(
          ...observacoesEstacao.map((x) => x.metric.precipTotal)
        );
        const precipitacaoAcumulada = observacoesEstacao
          .filter((x) => !!x.metric.precipTotal)
          .reduce((acc, valor) => acc + valor.metric.precipTotal, 0)
          .toFixed(2);
        return {
          id: STATIONS[station].NOME,
          minima,
          maxima,
          ventoMaximo,
          precipitacaoMaxima,
          precipitacaoAcumulada,
        };
      });
    },

    calcularMaximosGlobais() {
      this.maxima = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.maxima)
      );
      this.dadosMaxima = this.observacoes.find(
        (obs) => obs.metric.tempHigh == this.maxima
      );
      this.minima = Math.min(
        ...this.metadadosEstacoes.map((dado) => dado.minima)
      );
      this.dadosMinima = this.observacoes.find(
        (obs) => obs.metric.tempLow == this.minima
      );
      this.ventoMaximo = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.ventoMaximo)
      );
      this.dadosVentoMaximo = this.observacoes.find(
        (obs) => obs.metric.windgustHigh == this.ventoMaximo
      );
      this.precipitacaoMaxima = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.precipitacaoMaxima)
      );
      this.dadosPrecipitacaoMaxima = this.observacoes.find(
        (obs) => obs.metric.precipTotal == this.precipitacaoMaxima
      );
    },

    atualizarDadosAtuais() {
      setInterval(async () => {
        this.carregandoTempoReal = true;
        await this.obterDadosAtuaisTodasEstacoes();
        this.atualizacao = new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        });
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
        precipitacaoRestante: (
          x.precipitacaoAcumulada - x.precipitacaoMaxima
        ).toFixed(2),
      }));

      const series = [
        {
          name: "Precipitação máxima",
          data: data.map((x) => x.precipitacaoMaxima),
          color: this.cores.INDIGO_ESCURO,
        },
        {
          name: "Precipitação restante",
          data: data.map((x) => x.precipitacaoRestante),
          color: this.cores.INDIGO,
        },
      ];

      if (
        this.periodoSelecionado === this.periodos.DIA_ESPECIFICO ||
        this.periodoSelecionado === this.periodos.HOJE
      ) {
        series.splice(1, 1); // Remove a série "Precipitação restante"
      }

      this.$refs.graficoPrecipitacao.updateOptions({
        series: series,
        xaxis: {
          categories: dadosFiltrados.map((x) =>
            x.id.length > 15 ? `${x.id.substring(0, 15)}...` : x.id
          ),
        },
      });
    },

    atualizarGraficoTemporal() {
      const dados = Object.keys(this.estacoes).map((estacao) => ({
        name: this.estacoes[estacao].NOME,
        data: this.observacoes.reduce((acc, ob) => {
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

    async donwloadCsv() {
      const dados = [...this.observacoes];

      const opts = {
        types: [
          {
            description: "CSV",
            accept: { "text/csv": [".csv"] },
          },
        ],
        suggestedName: `dados.csv`,
      };

      try {
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();

        const csvString = dados.reduce((acc, valor) => {
          return (
            acc +
            "\n" +
            Object.keys(valor).map((key) =>
              key === "metric"
                ? Object.keys(valor[key]).map(
                    (metricKey) => `${metricKey},${valor[key][metricKey]}`
                  )
                : `${key},${valor[key]}`
            )
          );
        }, "");

        await writable.write(csvString);
        await writable.close();
        this.$q.notify({
          message: `Arquivo ${handle.name} salvo com sucesso!`,
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
      } catch (err) {
        this.$q.notify({
          message: `${err.message}`,
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
