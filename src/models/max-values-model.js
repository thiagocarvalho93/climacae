export default class MaxValues {
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

  updateMaxMinValues(stationsMetrics) {
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

  updateObservationData(observations) {
    observations.forEach((obs) => {
      if (obs.metric.tempHigh === this.maxima) this.dadosMaxima = obs;
      if (obs.metric.tempLow === this.minima) this.dadosMinima = obs;
      if (obs.metric.windgustHigh === this.ventoMaximo)
        this.dadosVentoMaximo = obs;
      if (obs.metric.precipTotal === this.precipitacaoMaxima)
        this.dadosPrecipitacaoMaxima = obs;
    });

    console.log(this.precipitacaoMaxima);
    console.log(this.dadosPrecipitacaoMaxima);
  }

  getResults() {
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
