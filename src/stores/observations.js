import { defineStore } from "pinia";
import weatherApi from "src/api/weather-api";
import ObservationCurrent from "src/models/observation-current-model";
import Observation from "src/models/observation-model";
import dataUtils from "src/utils/data-utils";

export const useObservationStore = defineStore("observation", {
  state: () => ({
    realTimeObservations: [],
    observations: [],
    cachedObservations: new Map(),
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
      const cached = this.cachedObservations.get("today");

      if (cached) {
        this.observations = cached;
        return;
      }

      const promises = stationsArray.map((station) =>
        weatherApi.obterObservacoesDiaAtualEstacao(station)
      );

      const responses = await Promise.all(promises);
      const observations = responses
        .flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        )
        .reverse();

      this.observations = observations;
      this.cachedObservations.set("today", observations);
    },

    async getSpecificDayObservations(stationsArray, date) {
      const cacheKey = date.toLocaleDateString();
      const cached = this.cachedObservations.get(cacheKey);

      if (cached) {
        this.observations = cached;
        return;
      }

      const dataFormatada = dataUtils.formatDateForQuery(date);

      const promises = stationsArray.map((station) =>
        weatherApi.obterTodasObservacoesDia(station, dataFormatada)
      );

      const responses = await Promise.all(promises);

      const observations = responses
        .flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        )
        .reverse();

      this.observations = observations;
      this.cachedObservations.set(cacheKey, observations);
    },

    async getPeriodDailyObservations(stationsArray, startDate, finalDate) {
      const cacheKey = `${startDate.toLocaleDateString()}-${finalDate.toLocaleDateString()}`;
      const cached = this.cachedObservations.get(cacheKey);

      if (cached) {
        this.observations = cached;
        return;
      }

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

      const observations = responses
        .flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        )
        .reverse();

      this.observations = observations;
      this.cachedObservations.set(cacheKey, observations);
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
