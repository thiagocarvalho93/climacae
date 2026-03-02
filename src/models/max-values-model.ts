import Observation from "./observation-model";
import StationMetrics from "./station-metrics-model";

export interface IMaxValuesResults {
  maxima: number;
  minima: number;
  ventoMaximo: number;
  precipitacaoMaxima: number;
  dadosMaxima: Observation | null;
  dadosMinima: Observation | null;
  dadosVentoMaximo: Observation | null;
  dadosPrecipitacaoMaxima: Observation | null;
}

export default class MaxValues {
  maxima: number;
  minima: number;
  ventoMaximo: number;
  precipitacaoMaxima: number;
  dadosMaxima: Observation | null;
  dadosMinima: Observation | null;
  dadosVentoMaximo: Observation | null;
  dadosPrecipitacaoMaxima: Observation | null;

  constructor() {
    this.maxima = 0;
    this.minima = Infinity;
    this.ventoMaximo = 0;
    this.precipitacaoMaxima = 0;
    this.dadosMaxima = null;
    this.dadosMinima = null;
    this.dadosVentoMaximo = null;
    this.dadosPrecipitacaoMaxima = null;
  }

  updateMaxMinValues(stationsMetrics: StationMetrics[]): void {
    stationsMetrics.forEach(
      ({ maxima, minima, ventoMaximo, precipitacaoMaxima }) => {
        this.maxima = Math.max(this.maxima, maxima);
        this.minima =
          this.minima === Infinity || (minima < this.minima && minima !== 0)
            ? minima
            : this.minima;
        this.ventoMaximo = Math.max(this.ventoMaximo, ventoMaximo);
        this.precipitacaoMaxima = Math.max(
          this.precipitacaoMaxima,
          precipitacaoMaxima
        );
      }
    );
  }

  updateObservationData(observations: Observation[]): void {
    observations.forEach((obs) => {
      // Usando double equal ou cast aqui porque o metric pode conter strings da API
      if (Number(obs.metric.tempHigh) === this.maxima) this.dadosMaxima = obs;
      if (Number(obs.metric.tempLow) === this.minima) this.dadosMinima = obs;
      if (Number(obs.metric.windgustHigh) === this.ventoMaximo)
        this.dadosVentoMaximo = obs;
      if (Number(obs.metric.precipTotal) === this.precipitacaoMaxima)
        this.dadosPrecipitacaoMaxima = obs;
    });
  }

  getResults(): IMaxValuesResults {
    return {
      maxima: this.maxima,
      minima: this.minima,
      ventoMaximo: this.ventoMaximo,
      precipitacaoMaxima: this.precipitacaoMaxima,
      dadosMaxima: this.dadosMaxima,
      dadosMinima: this.dadosMinima,
      dadosVentoMaximo: this.dadosVentoMaximo,
      dadosPrecipitacaoMaxima: this.dadosPrecipitacaoMaxima,
    };
  }
}
