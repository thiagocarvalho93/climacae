<template>
  <q-page class="q-pa-md bg-blue-grey-1">
    <div class="row q-col-gutter-md fade">
      <div class="col-3">
        <q-card flat bordered>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" />
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-3">
        <q-card flat bordered>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" />
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-3">
        <q-card flat bordered>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" />
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-3">
        <q-card flat bordered>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" />
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
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
      </div>

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <q-skeleton type="text" />
          </q-card-section>
          <q-skeleton height="200px" square />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { API_KEY, STATIONS } from "../constants/constants";

export default defineComponent({
  name: "IndexPage",

  components: {},

  data() {
    return {
      apiKey: API_KEY,
      estacoes: STATIONS,
    };
  },

  async mounted() {
    const response = await this.obterObservacoesDiaAnteriorEstacao(
      STATIONS.IMACA7.ID
    );
    console.log(response.data.observations.map((ob) => ob.metric.tempAvg));
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

    obterDadosEstacao(codigoEstacao) {},
  },
});
</script>
