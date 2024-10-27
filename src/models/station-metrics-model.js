export default class StationMetrics {
  constructor(name, tempLow, tempHigh, windgustHigh, precipRate) {
    this.id = name;
    this.minima = Number(tempLow);
    this.maxima = Number(tempHigh);
    this.ventoMaximo = Number(windgustHigh);
    this.precipitacaoMaxima = Number(precipRate);
    this.precipitacaoAcumulada = Number(precipRate);
  }

  update(tempLow, tempHigh, windgustHigh, precipRate) {
    if (tempLow) {
      this.minima = Math.min(this.minima, tempLow);
    }
    this.maxima = Math.max(this.maxima, tempHigh);
    this.ventoMaximo = Math.max(this.ventoMaximo, windgustHigh);
    this.precipitacaoMaxima = Math.max(this.precipitacaoMaxima, precipRate);
    this.precipitacaoAcumulada += precipRate;
  }
}
