import { defineStore } from "pinia";
import weatherv2Api from "src/api/weatherv2-api";
import {
  WeatherData,
  WeatherReport,
  WeatherStation,
} from "src/models/statistics";
import dataUtils from "src/utils/data-utils";

export const useStatisticsStore = defineStore("observation2", {
  state: () => ({
    stations: [new WeatherStation()],
    maxTemp: new WeatherData(),
    minTemp: new WeatherData(),
    maxWind: new WeatherData(),
    maxPrecipitation: new WeatherData(),
    totalPrecipitation: new WeatherData(),
  }),

  getters: {
    getMaxTemp(state) {
      return state.maxTemp;
    },

    getMinTemp(state) {
      return state.minTemp;
    },

    getMaxWind(state) {
      return state.maxWind;
    },

    getMaxPrecipitation(state) {
      return state.maxPrecipitation;
    },

    getTotalPrecipitation(state) {
      return state.totalPrecipitation;
    },
  },

  actions: {
    async getDailyStatistics(date = null) {
      const response = await weatherv2Api.getDailyStatistics({
        date: dataUtils.formatDateForQuery(new Date(date)),
      });

      this._mapResponseToStore(response);
    },

    _mapResponseToStore(response) {
      const data = WeatherReport.fromJson(response.data);

      this.maxTemp = data.maxTemp;
      this.minTemp = data.minTemp;
      this.maxWind = data.maxWind;
      this.maxPrecipitation = data.maxPrecipitation;
      this.totalPrecipitation = data.totalPrecipitation;
      this.stations = data.stations;
    },
  },
});