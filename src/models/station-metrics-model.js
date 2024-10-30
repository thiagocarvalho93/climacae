export default class StationMetrics {
  constructor(name, tempLow, tempHigh, windgustHigh, precipTotal) {
    this.id = name;
    this.minima = Number(tempLow);
    this.maxima = Number(tempHigh);
    this.ventoMaximo = Number(windgustHigh);
    this.precipitacaoMaxima = Number(precipTotal);
    this.precipitacaoAcumulada = Number(precipTotal);
  }

  update(tempLow, tempHigh, windgustHigh, precipTotal) {
    if (tempLow) {
      this.minima = Math.min(this.minima, tempLow);
    }
    this.maxima = Math.max(this.maxima, tempHigh);
    this.ventoMaximo = Math.max(this.ventoMaximo, windgustHigh);
    this.precipitacaoMaxima = Math.max(this.precipitacaoMaxima, precipTotal);
    this.precipitacaoAcumulada += precipTotal;
  }
}
