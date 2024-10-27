import { defineStore } from "pinia";
import weatherApi from "src/api/weather-api";
import { STATIONS } from "src/constants/constants";
import Metric from "src/models/metric-model";
import ObservationCurrent from "src/models/observation-current-model";
import Observation from "src/models/observation-model";
import StationMetrics from "src/models/station-metrics-model";
import dataUtils from "src/utils/data-utils";

export const useObservationStore = defineStore("observation", {
  state: () => ({
    realTimeObservations: [],
    observations: [],
    cachedObservations: new Map(),
    cachedRealTimeObservations: null,
    startDate: new Date(),
    endDate: new Date(),
    metadadosEstacoes: [],
  }),

  getters: {
    getObservations(state) {
      return state.observations;
    },
    getStartDate(state) {
      return state.startDate;
    },
    getEndDate(state) {
      return state.endDate;
    },
  },

  actions: {
    setStartDate(date) {
      this.startDate = date;
    },
    setEndDate(date) {
      this.endDate = date;
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
      if (this.cachedRealTimeObservations) {
        const { iat, observations } = this.cachedRealTimeObservations;
        const thirtySecondsAgo = new Date(Date.now() - 30000);

        if (iat >= thirtySecondsAgo) {
          this.realTimeObservations = observations;
          return;
        }
      }

      const promises = stationsArray.map((station) =>
        weatherApi.obterDadosTempoReal(station)
      );

      const responses = await Promise.all(promises);

      const observations = responses.flatMap((response) =>
        (response.data?.observations || []).map(
          (ob) => new ObservationCurrent(ob)
        )
      );

      this.realTimeObservations = observations;
      this.cachedRealTimeObservations = {
        observations,
        iat: new Date(),
      };
    },

    calcularMetadados() {
      this.metadadosEstacoes = [];

      const metadadosMap = this.observations.reduce((acc, obs) => {
        const { metric, stationID } = obs;
        const { tempHigh, tempLow, windgustHigh, precipRate } = new Metric(
          metric
        );
        const stationName = STATIONS[stationID].NOME;

        if (!acc[stationName]) {
          acc[stationName] = new StationMetrics(
            stationName,
            tempLow,
            tempHigh,
            windgustHigh,
            precipRate
          );
        } else {
          acc[stationName].update(tempLow, tempHigh, windgustHigh, precipRate);
        }

        return acc;
      }, {});

      this.metadadosEstacoes = Object.values(metadadosMap);
    },
  },
});
