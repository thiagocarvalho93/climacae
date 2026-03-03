import { defineStore } from "pinia";
import weatherApi from "src/api/weather-api";
import { STATIONS } from "src/constants/constants";
import MaxValues, { IMaxValuesResults } from "src/models/max-values-model";
import Metric from "src/models/metric-model";
import ObservationCurrent from "src/models/observation-current-model";
import Observation from "src/models/observation-model";
import StationMetrics from "src/models/station-metrics-model";
import dataUtils from "src/utils/data-utils";

interface CachedObservation {
  data: Observation[];
  timestamp: number;
}

interface ObservationState {
  realTimeObservations: ObservationCurrent[];
  observations: Observation[];
  stationObservations: Observation[];
  cachedObservations: Map<string, CachedObservation>;
  cachedRealTimeObservations: {
    observations: ObservationCurrent[];
    iat: Date;
  } | null;
  startDate: Date;
  endDate: Date;
}

const TODAY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useObservationStore = defineStore("observation", {
  state: (): ObservationState => ({
    realTimeObservations: [],
    observations: [],
    stationObservations: [],
    cachedObservations: new Map(),
    cachedRealTimeObservations: null,
    startDate: new Date(),
    endDate: new Date(),
  }),

  getters: {
    getObservations(state): Observation[] {
      return state.observations;
    },
    getStartDate(state): Date {
      return state.startDate;
    },
    getEndDate(state): Date {
      return state.endDate;
    },

    stationsMetrics(state): StationMetrics[] {
      if (!state.observations.length) return [];

      const metadadosMap = state.observations.reduce((acc, obs) => {
        const { metric, stationID } = obs;
        const { tempHigh, tempLow, windgustHigh, precipTotal } = new Metric(
          metric
        );

        if (!stationID || !STATIONS[stationID as keyof typeof STATIONS])
          return acc;

        const stationName = STATIONS[stationID as keyof typeof STATIONS].NAME;

        if (!acc[stationName]) {
          acc[stationName] = new StationMetrics(
            stationName,
            tempLow,
            tempHigh,
            windgustHigh,
            precipTotal
          );
        } else {
          acc[stationName].update(
            Number(tempLow),
            Number(tempHigh),
            Number(windgustHigh),
            Number(precipTotal)
          );
        }

        return acc;
      }, {} as Record<string, StationMetrics>);

      return Object.values(metadadosMap);
    },

    maxValues(): IMaxValuesResults {
      const maxValues = new MaxValues();

      maxValues.updateMaxMinValues(this.stationsMetrics);
      maxValues.updateObservationData(this.observations);

      return maxValues.getResults();
    },
  },

  actions: {
    //#region Dates
    setStartDate(date: Date) {
      this.startDate = date;
    },
    setEndDate(date: Date) {
      this.endDate = date;
    },
    //#region Get observations
    async getTodayObservations(stationsArray: string[]) {
      const cacheKey = "today";
      const cached = this.cachedObservations.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.timestamp < TODAY_CACHE_TTL) {
        this.observations = cached.data;
        return;
      }

      const promises = stationsArray.map((station) =>
        weatherApi.getStationCurrentDayObservations(station)
      );

      const responses = await Promise.all(promises);
      const observations = responses
        .flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        )
        .reverse();

      this.observations = observations;
      this.cachedObservations.set(cacheKey, {
        data: observations,
        timestamp: now,
      });
    },

    async getSpecificDayObservations(stationsArray: string[], date: Date) {
      const cacheKey = date.toLocaleDateString();
      const cached = this.cachedObservations.get(cacheKey);
      const now = Date.now();

      // If it's today, apply TTL. If it's past, eternal cache.
      const isToday = dataUtils.isToday(date);

      if (cached) {
        if (!isToday || now - cached.timestamp < TODAY_CACHE_TTL) {
          this.observations = cached.data;
          return;
        }
      }

      const dataFormatada = dataUtils.formatDateForQuery(date);

      const promises = stationsArray.map((station) =>
        weatherApi.getAllObservationsByDay(station, dataFormatada)
      );

      const responses = await Promise.all(promises);

      const observations = responses
        .flatMap((response) =>
          (response.observations || []).map((ob) => new Observation(ob))
        )
        .reverse();

      this.observations = observations;
      this.cachedObservations.set(cacheKey, {
        data: observations,
        timestamp: now,
      });
    },

    async getPeriodDailyObservations(
      stationsArray: string[],
      startDate: Date,
      finalDate: Date
    ) {
      const cacheKey = `${startDate.toLocaleDateString()}-${finalDate.toLocaleDateString()}`;
      const cached = this.cachedObservations.get(cacheKey);
      const now = Date.now();

      // If the period includes "today", we might want to expire, but usually historical periods don't change.
      // For simplicity, expire if finalDate is today.
      const endsToday = dataUtils.isToday(finalDate);

      if (cached) {
        if (!endsToday || now - cached.timestamp < TODAY_CACHE_TTL) {
          this.observations = cached.data;
          return;
        }
      }

      const formatedStartDate = dataUtils.formatDateForQuery(startDate);
      const formatedFinalDate = dataUtils.formatDateForQuery(finalDate);

      const promises = stationsArray.map((station) =>
        weatherApi.getDailyObservationsByPeriod(
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
      this.cachedObservations.set(cacheKey, {
        data: observations,
        timestamp: now,
      });
    },

    //#region Get by station
    async getStationTodayObservations(idEstacao: string) {
      const response = await weatherApi.getStationCurrentDayObservations(
        idEstacao
      );

      this.stationObservations = response.observations
        ? response.observations.map((obs) => new Observation(obs))
        : [];
    },

    async getStationPeriodDailyObservations(
      stationId: string,
      startDate: Date,
      finalDate: Date
    ) {
      const formatedStartDate = dataUtils.formatDateForQuery(startDate);
      const formatedFinalDate = dataUtils.formatDateForQuery(finalDate);

      const response = await weatherApi.getDailyObservationsByPeriod(
        stationId,
        formatedStartDate,
        formatedFinalDate
      );

      this.stationObservations = response.observations
        ? response.observations.map((res) => new Observation(res))
        : [];
    },

    async getStationDayObservations(stationId: string, date: Date) {
      const formattedDate = dataUtils.formatDateForQuery(date);

      const response = await weatherApi.getAllObservationsByDay(
        stationId,
        formattedDate
      );

      this.stationObservations = response.observations
        ? response.observations.map((res) => new Observation(res))
        : [];
    },

    //#region Real time
    async getRealTimeObservations(stationsArray: string[]) {
      if (this.cachedRealTimeObservations) {
        const { iat, observations } = this.cachedRealTimeObservations;
        const thirtySecondsAgo = new Date(Date.now() - 30000);

        if (iat >= thirtySecondsAgo) {
          this.realTimeObservations = observations;
          return;
        }
      }

      const promises = stationsArray.map((station) =>
        weatherApi.getRealTimeData(station)
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
  },
});
