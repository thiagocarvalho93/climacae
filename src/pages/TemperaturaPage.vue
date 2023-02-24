<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page class="q-pa-md bg-blue-grey-1">
    <div class="q-pa-md row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="fade">
            <div class="q-pa-md row q-col-gutter-md">
              <div class="col-12 col-xs-6 col-sm-5 col-md-3">
                <q-select filled color="light-blue-7" label-color="light-blue-7" v-model="estacaoSelecionada"
                  :options="estacoes.map((estacao) => estacao.ID)" @update:model-value="obterDados" label="Estação">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>
          <q-separator class="q-mb-sm"></q-separator>
          <q-card-section class="fade">
            <apexchart height="350" :options="chartOptions" :series="series" ref="graficoTemperatura"></apexchart>
          </q-card-section>

          <q-inner-loading :showing="carregando" label="Aguarde..." label-class="text-teal"
            label-style="font-size: 1.1em" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { STATIONS } from "../constants/constants";
import { API_KEY } from "src/constants/secrets";

export default defineComponent({
  name: "TemperaturaPage",

  components: {},

  data() {
    return {
      carregando: true,
      estacoes: [],
      estacaoSelecionada: "",
      apiKey: API_KEY,
      series: [
        {
          name: "Temperaturas",
          data: [[new Date(1676126700 * 1000), 10]],
        },
      ],
      chartOptions: {
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
          min: 5,
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
      this.carregando = true;
      try {
        const response = await this.obterObservacoesDiaAnteriorEstacao(
          this.estacaoSelecionada
        );
        this.dados = response;
      } catch (error) {
        console.log("Erro: ", error);
      }
      this.atualizarGrafico();
      this.carregando = false;
    },

    atualizarGrafico() {
      this.$refs.graficoTemperatura.updateSeries([
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
      ]);
    },
  },
});
</script>

<style scoped></style>
