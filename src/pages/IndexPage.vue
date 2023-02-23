<template>
  <q-pull-to-refresh @refresh="refresh">
    <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
      <span class="text-h6 text-bold fade">Macaé - {{ new Date().toLocaleDateString("pt-br") }}</span>
      <q-separator class="q-my-sm"></q-separator>
      <div class="row q-col-gutter-md fade">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat dark class="maxima">
            <q-card-section>
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
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-red"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat dark class="minima">
            <q-card-section>
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
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-primary"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat dark class="vento">
            <q-card-section>
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
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat dark class="precipitacao">
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label> PRECIPITAÇÃO MÁXIMA </q-item-label>
                  <q-item-label class="text-bold text-h6">
                    {{ precipitacaoMaxima }}mm
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon class="icon" size="lg" name="water_drop" />
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-indigo"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-4">
          <q-card flat>
            <q-card-section class="text-h6"> Agora </q-card-section>
            <q-card-section>
              <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated
                :control-color="darkMode ? 'white' : 'primary'" padding navigation arrows infinite height="265px"
                :autoplay="autoplayCarousel" class="bg-transparent" @mouseenter="autoplay = false"
                @mouseleave="autoplay = true">
                <q-carousel-slide v-for="dados in metadadosEstacoes" :key="dados.id" :name="dados.id"
                  class="column no-wrap flex-center">
                  <div class="q-mt-md text-center text-h6">
                    {{ dados.id }}
                  </div>
                  <div class="q-mt-md text-h5 text-center">
                    <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="lg" name="thermostat" />
                    {{ dados.temperaturaAtual }}°C
                  </div>
                  <div class="q-mt-md text-h5 text-center">
                    <q-icon class="icon" :color="darkMode ? 'white' : 'primary'" size="lg" name="water_drop" />
                    {{ dados.precipitacao }}mm
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </q-card-section>
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-8">
          <q-card flat>
            <q-card-section class="text-h6"> Máximas e mínimas </q-card-section>
            <q-card-section>
              <apexchart type="bar" height="250" :options="chartTemperaturaOptions" :series="seriesTemperatura"
                ref="graficoColunaTemperatura"></apexchart>
            </q-card-section>
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12 col-sm-12">
          <q-card flat>
            <q-card-section class="text-h6"> Precipitação </q-card-section>
            <q-card-section>
              <apexchart type="bar" height="250" :options="chartPrecipitacaoOptions" :series="seriesPrecipitacao"
                ref="graficoPrecipitacao"></apexchart>
            </q-card-section>
            <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
              label-style="font-size: 1.1em" />
          </q-card>
        </div>

        <div class="col-12">
          <q-table :class="darkMode ? 'my-sticky-header-table-dark' : 'my-sticky-header-table'" flat
            title="Dados das estações" :rows="observacoes" :columns="columns" :pagination="pagination" :filter="filter"
            :rows-per-page-options="[6, 12, 24, 48, 96]" row-key="name" :loading="carregando
            ">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { defineComponent } from "vue";
import { STATIONS, CORES } from "../constants/constants";
import { API_KEY } from "src/constants/secrets";

export default defineComponent({
  name: "IndexPage",

  components: {},

  computed: {
    darkMode() {
      return this.$q.dark.isActive;
    }
  },

  watch: {
    darkMode(newThemeDark, oldThemeDark) {
      this.$refs.graficoColunaTemperatura.updateOptions({
        theme: {
          mode: newThemeDark ? "dark" : "light"
        }
      })

      this.$refs.graficoPrecipitacao.updateOptions({
        theme: {
          mode: newThemeDark ? "dark" : "light"
        }
      })
    }
  },

  data() {
    return {
      carregando: true,
      slide: STATIONS[Object.keys(STATIONS)[0]].NOME,
      autoplayCarousel: true,
      cores: CORES,
      apiKey: API_KEY,
      estacoes: STATIONS,
      metadadosEstacoes: [],
      observacoes: [],
      minima: 0,
      maxima: 0,
      ventoMaximo: 0,
      precipitacaoMaxima: 0,
      pagination: {
        rowsPerPage: 12
      },
      filter: "",
      columns: [
        {
          name: "horário",
          required: true,
          label: "Horário",
          align: "left",
          field: (row) => row.obsTimeLocal,
          format: (val) => `${new Date(val).toLocaleTimeString()}`,
          sortable: true,
          style: 'width: 50px',
          align: "left",
        },
        {
          name: "idEstacao",
          align: "center",
          label: "ID estação",
          field: (row) => row.stationID,
          sortable: true,
          style: 'width: 50px',
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
          name: "temp",
          label: "Temperatura (°C)",
          field: (row) => row.metric.tempAvg,
          sortable: true,
          align: "left",
        },
        {
          name: "dewPoint",
          label: "Ponto de orvalho (°C)",
          field: (row) => row.metric.dewptAvg,
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
        {
          name: "radiation",
          label: "Irradiação solar (W/m²)",
          field: (row) => row.solarRadiationHigh,
          sortable: true,
          align: "left",
        },
      ],

      seriesTemperatura: [
        {
          name: "Máxima",
          color: CORES.VERMELHO,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Mínima",
          color: CORES.AZUL,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],

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
            endingShape: "rounded",
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          row: {
            // colors: ["#fff", "#f2f2f2"],
          },

          strokeDashArray: 7,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: Object.keys(STATIONS),
        },
        yaxis: {
          max: 40,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(1) + "°C";
            },
          },
        },
      },
      seriesPrecipitacao: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100],
          color: CORES.INDIGO,
        },
      ],
      chartPrecipitacaoOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 2,
            horizontal: true,
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
          strokeDashArray: 7,
          column: {
            // colors: ["#fff", "#f2f2f2"],
          },

          // strokeDashArray: 7,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: Object.keys(STATIONS),
        },
      },
    };
  },

  async mounted() {
    await this.obterCalcularEAtualizar();
  },

  methods: {
    async obterCalcularEAtualizar() {
      const inicioObtencao = new Date();
      this.carregando = true;
      await this.obterObservacoesTodasEstacoes();
      console.log(`Tempo de execução para obter dados: ${new Date() - inicioObtencao}ms`);
      const inicioCalculo = new Date();
      this.calcularMetadados();
      this.atualizarGraficoTemperatura();
      this.atualizarGraficoPrecipitacao();
      console.log(`Tempo de execução para manipular dados: ${new Date() - inicioCalculo}ms`);
      this.carregando = false;
    },

    async refresh(done) {
      await this.obterCalcularEAtualizar();
      done();
    },

    async obterObservacoesDiaAtualEstacao(codigoEstacao) {
      return new Promise((resolve, reject) => {
        return this.$api
          .get(
            `/pws/observations/all/1day?apiKey=${this.apiKey}&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`
          )
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      });
    },

    async obterObservacoesTodasEstacoes() {
      const stations = Object.keys(STATIONS);

      try {
        const dados = await Promise.all(
          stations.map((station) =>
            this.obterObservacoesDiaAtualEstacao(station)
          )
        );
        dados.forEach(
          (x) => x.observations && this.observacoes.push(...x.observations)
        );
      } catch (error) {
        console.log(error);
      }
    },

    calcularMetadados() {
      this.metadadosEstacoes = [];

      Object.keys(STATIONS).forEach((station) => {
        this.metadadosEstacoes.push({
          id: STATIONS[station].NOME,
          minima: Math.min(
            ...this.observacoes
              .filter((x) => x.stationID == station)
              .map((x) => x.metric.tempLow)
          ),
          maxima: Math.max(
            ...this.observacoes
              .filter((x) => x.stationID == station)
              .map((x) => x.metric.tempHigh)
          ),
          temperaturaAtual: this.observacoes
            .filter((x) => x.stationID == station).at(-1).metric.tempAvg,
          ventoMaximo: Math.max(
            ...this.observacoes
              .filter((x) => x.stationID == station)
              .map((x) => x.metric.windgustHigh)
          ),
          precipitacao: this.observacoes
            .filter((x) => x.stationID == station).at(-1).metric.precipTotal,
        });
        console.log(this.observacoes
          .filter((x) => x.stationID == station).slice(-1))
      });

      this.maxima = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.maxima)
      );
      this.minima = Math.min(
        ...this.metadadosEstacoes.map((dado) => dado.minima)
      );
      this.ventoMaximo = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.ventoMaximo)
      );
      this.precipitacaoMaxima = Math.max(
        ...this.metadadosEstacoes.map((dado) => dado.precipitacao)
      );
    },

    atualizarGraficoTemperatura() {
      this.$refs.graficoColunaTemperatura.updateSeries([
        {
          name: "Máxima",
          color: CORES.VERMELHO,
          data: this.metadadosEstacoes
            .map((x) => x.maxima)
            .filter((x) => x != -Infinity),
        },
        {
          name: "Mínima",
          color: CORES.AZUL,
          data: this.metadadosEstacoes
            .map((x) => x.minima)
            .filter((x) => x != Infinity),
        },
      ]);

      this.$refs.graficoColunaTemperatura.updateOptions({
        xaxis: {
          categories: this.metadadosEstacoes
            .filter((x) => x.maxima != -Infinity && x.minima != Infinity)
            .map((x) => x.id),
        },
      });
    },

    atualizarGraficoPrecipitacao() {
      this.$refs.graficoPrecipitacao.updateSeries([
        {
          data: this.metadadosEstacoes.map((x) => x.precipitacao),
        },
      ]);
      this.$refs.graficoPrecipitacao.updateOptions({
        xaxis: {
          categories: this.metadadosEstacoes
            .map((x) => x.id),
        },
      });
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
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0s
  background-image: linear-gradient(to right,$red-6, $red-8)

.minima
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0.2s
  background-image: linear-gradient(to right,$blue-6, $blue-8)

.vento
  animation-name: zoomInOut
  animation-duration: 0.4s
  animation-timing-function: ease
  animation-delay: 0.4s
  background-image: linear-gradient(to right,$teal-6, $teal-8)

.precipitacao
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
