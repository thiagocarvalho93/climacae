<template>
  <q-page class="q-pa-md bg-blue-grey-1">
    <span class="text-h6 fade">Macaé - {{ new Date().toLocaleDateString("pt-br") }}</span>
    <q-separator class="q-my-sm"></q-separator>
    <div class="row q-col-gutter-md fade">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat dark class="bg-red maxima">
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
        <q-card flat dark class="bg-primary minima">
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
        <q-card flat dark class="bg-teal vento">
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

      <div class="col-12 col-sm-6 col-md-3 precipitacao">
        <q-card flat dark class="bg-indigo">
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

      <div class="col-12 col-sm-8">
        <q-card flat>
          <q-card-section class="text-h6"> Temperatura </q-card-section>
          <q-card-section>
            <apexchart type="bar" height="250" :options="chartTemperaturaOptions" :series="seriesTemperatura"
              ref="graficoColunaTemperatura"></apexchart>
          </q-card-section>
          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
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
        <q-table class="my-sticky-header-table" flat title="Dados das estações" :rows="observacoes" :columns="columns"
          :pagination="pagination" :filter="filter" :rows-per-page-options="[6, 12, 24, 48, 96]" row-key="name" :loading="carregando
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
</template>

<script>
import { defineComponent } from "vue";
import { STATIONS, CORES } from "../constants/constants";
import { API_KEY } from "src/constants/secrets";

export default defineComponent({
  name: "IndexPage",

  components: {},

  data() {
    return {
      carregando: true,
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
          ventoMaximo: Math.max(
            ...this.observacoes
              .filter((x) => x.stationID == station)
              .map((x) => x.metric.windgustHigh)
          ),
          precipitacao: this.observacoes
            .filter((x) => x.stationID == station)
            .reduce((acc, valor) => {
              return (
                acc?.metric?.precipTotal ?? 0 + valor?.metric?.precipTotal ?? 0
              );
            }, 0),
        });
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
    },

  },
});
</script>

<style scoped>
.maxima {
  animation-name: zoomInOut;
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0s;
}

.minima {
  animation-name: zoomInOut;
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0.2s;
}

.vento {
  animation-name: zoomInOut;
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0.4s;
}

.precipitacao {
  animation-name: zoomInOut;
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0.6s;
}

.sticky-header-table {
  height: 310px;
}
</style>

<style lang="sass">
\:root
  --scrollbar-width-height        : 10px
  --scrollbar-track               : #eeeeee
  --scrollbar-thumb               : rgb(204,231,255)
  --scrollbar-thumb-hover         : rgb(33,118,210)
  --scrollbar-track-dark          : #eeeeee
  --scrollbar-thumb-dark          : rgb(204,231,255)
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
</style>
