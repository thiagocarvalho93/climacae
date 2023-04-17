import { api } from "src/boot/axios";
import { API_KEY } from "src/constants/secrets";

async function obterDadosTempoReal(codigoEstacao) {
  return new Promise((resolve, reject) => {
    return api
      .get(
        `/pws/observations/current?apiKey=${API_KEY}&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

async function obterObservacoesDiariasPeriodo(
  codigoEstacao,
  dataInicial,
  dataFinal
) {
  //Formato das datas YYYYMMDD
  return new Promise((resolve, reject) => {
    return api
      .get(
        `/pws/history/daily?stationId=${codigoEstacao}&format=json&units=m&startDate=${dataInicial}&endDate=${dataFinal}&numericPrecision=decimal&apiKey=${API_KEY}`
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

async function obterTodasObservacoesDia(codigoEstacao, data) {
  //Formato das datas YYYYMMDD
  return new Promise((resolve, reject) => {
    return api
      .get(
        `/pws/history/all?stationId=${codigoEstacao}&format=json&units=m&date=${data}&numericPrecision=decimal&apiKey=${API_KEY}`
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

async function obterObservacoesDiaAtualEstacao(codigoEstacao) {
  return new Promise((resolve, reject) => {
    return api
      .get(
        `/pws/observations/all/1day?apiKey=${API_KEY}&stationId=${codigoEstacao}&numericPrecision=decimal&format=json&units=m`
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export default {
  obterDadosTempoReal,
  obterTodasObservacoesDia,
  obterObservacoesDiariasPeriodo,
  obterObservacoesDiaAtualEstacao,
};
