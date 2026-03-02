import { api } from "src/boot/axios";
import { IObservation } from "src/models/observation-model";
import { IObservationCurrent } from "src/models/observation-current-model";
import { AxiosResponse } from "axios";

export interface IWeatherResponse<T> {
  observations: T[];
}

async function obterDadosTempoReal(
  codigoEstacao: string
): Promise<AxiosResponse<IWeatherResponse<IObservationCurrent>>> {
  const url = `/pws/observations/current?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`;

  return await api.get<IWeatherResponse<IObservationCurrent>>(url);
}

async function obterObservacoesDiariasPeriodo(
  codigoEstacao: string,
  dataInicial: string,
  dataFinal: string
): Promise<IWeatherResponse<IObservation>> {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/daily?stationId=${codigoEstacao}&format=json&units=m&startDate=${dataInicial}&endDate=${dataFinal}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

async function obterTodasObservacoesDia(
  codigoEstacao: string,
  dataFormatada: string
): Promise<IWeatherResponse<IObservation>> {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/all?stationId=${codigoEstacao}&format=json&units=m&date=${dataFormatada}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

async function obterObservacoesDiaAtualEstacao(
  codigoEstacao: string
): Promise<IWeatherResponse<IObservation>> {
  const url = `/pws/observations/all/1day?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`;

  const { data } = await api.get<IWeatherResponse<IObservation>>(url);
  return data;
}

export default {
  obterDadosTempoReal,
  obterTodasObservacoesDia,
  obterObservacoesDiariasPeriodo,
  obterObservacoesDiaAtualEstacao,
};
