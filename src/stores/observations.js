import { defineStore } from "pinia";
import weatherApi from "src/api/weather-api";
import ObservationCurrent from "src/models/observation-current-model";
import Observation from "src/models/observation-model";
import dataUtils from "src/utils/data-utils";

export const useObservationStore = defineStore("observation", {
  state: () => ({
    realTimeObservations: [],
    observations: [],
  }),

  getters: {
    getObservations(state) {
      return state.observacoes;
    },
  },

  actions: {
    reverseObservations() {
      this.observations = this.observations.reverse();
    },

    async getTodayObservations(stationsArray) {
      const promises = stationsArray.map((station) =>
        weatherApi.obterObservacoesDiaAtualEstacao(station)
      );

      const responses = await Promise.all(promises);

      this.observations = responses.flatMap((response) =>
        (response.observations || []).map((ob) => new Observation(ob))
      );
    },

    async getSpecificDayObservations(stationsArray, date) {
      const dataFormatada = dataUtils.formatDateForQuery(date);

      const promises = stationsArray.map((station) =>
        weatherApi.obterTodasObservacoesDia(station, dataFormatada)
      );

      const responses = await Promise.all(promises);

      this.observations = responses.flatMap((response) =>
        (response.observations || []).map((ob) => new Observation(ob))
      );
    },

    async getPeriodDailyObservations(stationsArray, startDate, finalDate) {
      const formatedStartDate = dataUtils.formatDateForQuery(startDate);
      const formatedFinalDate = dataUtils.formatDateForQuery(finalDate);

      const promises = stationsArray.map((station) =>
        weatherApi.obterObservacoesDiariasPeriodo(
          station,
          formatedStartDate,
          formatedFinalDate
        )
      );

      const responses = await Promise.all(promises);

      this.observations = responses.flatMap((response) =>
        (response.observations || []).map((ob) => new Observation(ob))
      );
    },

    async getRealTimeObservations(stationsArray) {
      const promises = stationsArray.map((station) =>
        weatherApi.obterDadosTempoReal(station)
      );

      const responses = await Promise.all(promises);

      this.realTimeObservations = responses.flatMap((response) =>
        (response.data?.observations || []).map(
          (ob) => new ObservationCurrent(ob)
        )
      );
    },
  },
});
