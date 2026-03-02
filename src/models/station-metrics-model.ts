export interface IStationMetrics {
  id: string;
  minima: number;
  maxima: number;
  ventoMaximo: number;
  precipitacaoMaxima: number;
  precipitacaoAcumulada: number;
}

export default class StationMetrics implements IStationMetrics {
  id: string;
  minima: number;
  maxima: number;
  ventoMaximo: number;
  precipitacaoMaxima: number;
  precipitacaoAcumulada: number;

  constructor(
    name: string,
    tempLow: number | string,
    tempHigh: number | string,
    windgustHigh: number | string,
    precipTotal: number | string
  ) {
    this.id = name;
    this.minima = Number(tempLow);
    this.maxima = Number(tempHigh);
    this.ventoMaximo = Number(windgustHigh);
    this.precipitacaoMaxima = Number(precipTotal);
    this.precipitacaoAcumulada = Number(precipTotal);
  }

  update(
    tempLow: number,
    tempHigh: number,
    windgustHigh: number,
    precipTotal: number
  ): void {
    if (tempLow) {
      this.minima = Math.min(this.minima, tempLow);
    }
    this.maxima = Math.max(this.maxima, tempHigh);
    this.ventoMaximo = Math.max(this.ventoMaximo, windgustHigh);
    this.precipitacaoMaxima = Math.max(this.precipitacaoMaxima, precipTotal);
    this.precipitacaoAcumulada += precipTotal;
  }
}
