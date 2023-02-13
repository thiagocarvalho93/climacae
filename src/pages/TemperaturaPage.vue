<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-blue-grey-1">
    <div class="q-pa-md row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered>
          <div class="q-pa-md row q-col-gutter-md">
            <div class="col-3">
              <q-select
                dense
                outlined
                v-model="estacaoSelecionada"
                :options="estacoes.map((estacao) => estacao.ID)"
                label="Estação"
              />
            </div>
            <div class="col-5">
              <q-btn @click="obterDados">Pesquisar</q-btn>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <apexchart
              type="area"
              height="350"
              :options="chartOptions"
              :series="series"
              ref="graficoTemperatura"
            ></apexchart>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { API_KEY, STATIONS } from "../constants/constants";

export default defineComponent({
  name: "TemperaturaPage",

  components: {},

  data() {
    return {
      estacoes: [],
      estacaoSelecionada: "",
      apiKey: API_KEY,
      series: [
        {
          name: "Temperaturas",
          data: [
            [new Date(1676126700 * 1000), 10],
            [new Date(1676126701 * 1000), 35],
            [new Date(1676126702 * 1000), 49],
            [new Date(1676126703 * 1000), 69],
            [new Date(1676126704 * 1000), 148],
          ],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Temperatura",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          type: "datetime",
          tickAmount: 8,
        },
        yaxis: {
          min: 7,
          max: 40,
        },
      },
    };
  },

  async mounted() {
    this.estacoes = Object.values(STATIONS);
    this.estacaoSelecionada = this.estacoes[0].ID;
    await this.obterDados();
  },

  methods: {
    obterObservacoesDiaAnteriorEstacao(codigoEstacao) {
      // https://api.weather.com/v1/location/SBME:9:BR/observations/historical.json?apiKey=e1f10a1e78da46f5b10a1e78da96f525&units=m&startDate=20230122&endDate=20230122
      return new Promise((resolve, reject) => {
        return this.$api
          .get(
            `/pws/observations/all/1day?apiKey=${this.apiKey}&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`
          )
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    async obterDados() {
      try {
        const response = await this.obterObservacoesDiaAnteriorEstacao(
          this.estacaoSelecionada
        );
        console.log(response);
        this.dados = response;
      } catch (error) {
        console.log("Erro: ", error);
      }
      this.atualizarGrafico();
    },

    atualizarGrafico() {
      this.$refs.graficoTemperatura.updateSeries(
        [
          {
            name: "temperatura",
            data:
              this.dados &&
              this.dados.data &&
              this.dados.data.observations.map((ob) => [
                ob.epoch * 1000,
                ob.metric.tempAvg,
              ]),
          },
        ],
        false,
        true
      );
    },
  },
});
</script>
