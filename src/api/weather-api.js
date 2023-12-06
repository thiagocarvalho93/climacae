import { api } from "src/boot/axios";

async function obterDadosTempoReal(codigoEstacao) {
  const url = `/pws/observations/current?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`;

  return await api.get(url);
}

async function obterObservacoesDiariasPeriodo(
  codigoEstacao,
  dataInicial,
  dataFinal
) {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/daily?stationId=${codigoEstacao}&format=json&units=m&startDate=${dataInicial}&endDate=${dataFinal}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get(url);
  return data;
}

async function obterTodasObservacoesDia(codigoEstacao, dataFormatada) {
  //Formato das datas YYYYMMDD
  const url = `/pws/history/all?stationId=${codigoEstacao}&format=json&units=m&date=${dataFormatada}&numericPrecision=decimal&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;

  const { data } = await api.get(url);
  return data;
}

async function obterObservacoesDiaAtualEstacao(codigoEstacao) {
  const url = `/pws/observations/all/1day?apiKey=e1f10a1e78da46f5b10a1e78da96f525&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`;

  const { data } = await api.get(url);
  return data;
}

export default {
  obterDadosTempoReal,
  obterTodasObservacoesDia,
  obterObservacoesDiariasPeriodo,
  obterObservacoesDiaAtualEstacao,
};
