import { api } from "src/boot/axios";

const group = "/observations";

async function getStationDailyObservations(stationId, data) {
  var params = new URLSearchParams(data);
  const url = group + `/stations/${stationId}/daily`;

  return await api.get(url + params.toString());
}

async function getStationWeeklyObservations(stationId, data) {
  var params = new URLSearchParams(data);

  const url = group + `/stations/${stationId}/weekly`;

  return await api.get(url + params.toString());
}

async function getStationMonthlyObservations(stationId, data) {
  var params = new URLSearchParams(data);

  const url = group + `/stations/${stationId}/monthly`;
  return await api.get(url + params.toString());
}

async function getDailyStatistics(data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/all/daily`;
  return await api.get(url + params.toString());
}

async function getWeeklyStatistics(data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/all/weekly`;
  return await api.get(url + params.toString());
}

async function getMonthlyStatistics(data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/all/monthly`;
  return await api.get(url + params.toString());
}

async function getStationDailyStatistics(stationId, data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/stations/${stationId}/daily`;
  return await api.get(url + params.toString());
}

async function getStationWeeklyStatistics(stationId, data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/stations/${stationId}/weekly`;
  return await api.get(url + params.toString());
}

async function getStationMonthlyStatistics(stationId, data) {
  var params = new URLSearchParams(data);

  const url = group + `/statistics/stations/${stationId}/monthly`;
  return await api.get(url + params.toString());
}

export default {
  getStationDailyObservations,
  getStationWeeklyObservations,
  getStationMonthlyObservations,
  getDailyStatistics,
  getWeeklyStatistics,
  getMonthlyStatistics,
  getStationDailyStatistics,
  getStationWeeklyStatistics,
  getStationMonthlyStatistics,
};
