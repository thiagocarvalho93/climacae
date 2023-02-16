<template>
  <q-page class="q-pa-md bg-blue-grey-1">
    <div class="row q-col-gutter-md fade">
      <div class="col-3">
        <q-card flat bordered dark class="bg-red">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label> MÁXIMA </q-item-label>
                <q-item-label class="text-bold">
                  {{ maxima && maxima.metric && maxima.metric.tempHigh }}°C
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="thermostat" />
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

      <div class="col-3">
        <q-card flat bordered dark class="bg-blue">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label> MÍNIMA </q-item-label>
                <q-item-label class="text-bold">
                  {{ minima && minima.metric && minima.metric.tempHigh }}°C
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="thermostat" />
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

      <div class="col-3">
        <q-card flat bordered dark class="bg-teal">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label> VENTO MÁXIMO </q-item-label>
                <q-item-label class="text-bold">
                  {{
                    ventoMaximo &&
                    ventoMaximo.metric &&
                    ventoMaximo.metric.tempHigh
                  }}
                  km/h
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="wind_power" />
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

      <div class="col-3">
        <q-card flat bordered dark class="bg-indigo">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label> PRECIPITAÇÃO MÁXIMA </q-item-label>
                <q-item-label class="text-bold"> mm </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon class="icon" size="lg" name="water_drop" />
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

      <!-- <div class="col-6">
        <q-card flat bordered>
          <q-card-section>
            <q-skeleton type="text" />
          </q-card-section>
          <q-skeleton height="200px" square />
        </q-card>
      </div>

      <div class="col-6">
        <q-card flat bordered>
          <q-card-section>
            <q-skeleton type="text" />
          </q-card-section>
          <q-skeleton height="200px" square />
        </q-card>
      </div> -->

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <apexchart
              type="bar"
              height="350"
              :options="chartOptions"
              :series="series"
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
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { API_KEY, STATIONS, CORES } from "../constants/constants";

export default defineComponent({
  name: "IndexPage",

  components: {},

  data() {
    return {
      carregando: true,
      cores: CORES,
      apiKey: API_KEY,
      estacoes: STATIONS,
      observacoes: [],
      minima: 0,
      maxima: 0,
      ventoMaximo: 0,

      series: [
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

      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "45%",
            borderRadius: 1,
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
            colors: ["#fff", "#f2f2f2"],
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
          title: {
            text: "Temperatura (°C)",
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(1) + "°C";
            },
          },
        },
      },
    };
  },

  async mounted() {
    this.obterCalcularEAtualizar();
  },

  methods: {
    async obterCalcularEAtualizar() {
      this.carregando = true;
      await this.obterObservacoesTodasEstacoes();
      this.calcularMetadados();
      this.atualizarGraficoColuna();
      this.carregando = false;
    },

    async obterObservacoesDiaAnteriorEstacao(codigoEstacao) {
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
            this.obterObservacoesDiaAnteriorEstacao(station)
          )
        );

        dados.forEach((x) => this.observacoes.push(...x.observations));
        console.log(dados);
      } catch (error) {
        console.log(error);
      }
    },

    calcularMetadados() {
      this.maxima = this.observacoes.reduce((acc, valor) => {
        return valor.metric.tempLow > acc.metric.tempLow &&
          !!valor.metric.tempLow
          ? valor
          : acc;
      });

      this.minima = this.observacoes.reduce((acc, valor) => {
        return valor.metric.tempLow < acc.metric.tempLow &&
          !!valor.metric.tempLow
          ? valor
          : acc;
      });

      this.ventoMaximo = this.observacoes.reduce((acc, valor) => {
        return valor.metric.windgustHigh > acc.metric.windgustHigh &&
          !!valor.metric.windgustHigh
          ? valor
          : acc;
      });
      console.log(this.minima);
    },

    atualizarGraficoColuna() {
      let minimas = [];
      let maximas = [];
      Object.keys(STATIONS).forEach((station) => {
        minimas.push(
          this.observacoes
            .filter((x) => x.stationID == station)
            .reduce((acc, valor) => {
              return valor.metric.tempLow < acc.metric.tempLow &&
                !!valor.metric.tempLow
                ? valor
                : acc;
            })
        );
      });

      Object.keys(STATIONS).forEach((station) => {
        maximas.push(
          this.observacoes
            .filter((x) => x.stationID == station)
            .reduce((acc, valor) => {
              return valor.metric.tempHigh > acc.metric.tempHigh &&
                !!valor.metric.tempHigh
                ? valor
                : acc;
            })
        );
      });

      minimas = minimas.map((x) => x.metric.tempLow);
      maximas = maximas.map((x) => x.metric.tempHigh);
      console.log(minimas, maximas);

      this.$refs.graficoColunaTemperatura.updateSeries([
        {
          name: "Máxima",
          color: CORES.VERMELHO,
          data: maximas,
        },
        {
          name: "Mínima",
          color: CORES.AZUL,
          data: minimas,
        },
      ]);
    },

    obterDadosEstacao(codigoEstacao) {},
  },
});
</script>
