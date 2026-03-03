import { api } from "src/boot/axios";
import { IObservation } from "src/models/observation-model";
import { IObservationCurrent } from "src/models/observation-current-model";
import { AxiosResponse } from "axios";

export interface IWeatherResponse<T> {
  observations: T[];
}

async function getRealTimeData(
  stationId: string
): Promise<AxiosResponse<IWeatherResponse<IObservationCurrent>>> {
  const url = `/pws/observations/current?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${stationId}&numericPrecision=decimal&format=json&units=m`;

  return await api.get<IWeatherResponse<IObservationCurrent>>(url);
}

async function getDailyObservationsByPeriod(
  stationId: string,
  startDate: string,
  endDate: string
): Promise<IWeatherResponse<IObservation>> {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/daily?stationId=${stationId}&format=json&units=m&startDate=${startDate}&endDate=${endDate}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

async function getAllObservationsByDay(
  stationId: string,
  formattedDate: string
): Promise<IWeatherResponse<IObservation>> {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/all?stationId=${stationId}&format=json&units=m&date=${formattedDate}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

async function getStationCurrentDayObservations(
  stationId: string
): Promise<IWeatherResponse<IObservation>> {
  const url = `/pws/observations/all/1day?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${stationId}&numericPrecision=decimal&format=json&units=m`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

export default {
  getRealTimeData,
  getAllObservationsByDay,
  getDailyObservationsByPeriod,
  getStationCurrentDayObservations,
};
