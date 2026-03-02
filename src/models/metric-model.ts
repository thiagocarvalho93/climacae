export interface IMetric {
  dewptAvg?: number | string;
  dewptHigh?: number | string;
  dewptLow?: number | string;
  heatindexAvg?: number | string;
  heatindexHigh?: number | string;
  heatindexLow?: number | string;
  precipRate?: number | string;
  precipTotal?: number | string;
  pressureMax?: number | string;
  pressureMin?: number | string;
  pressureTrend?: number | string;
  tempAvg?: number | string;
  tempHigh?: number | string;
  tempLow?: number | string;
  windchillAvg?: number | string;
  windchillHigh?: number | string;
  windchillLow?: number | string;
  windgustAvg?: number | string;
  windgustHigh?: number | string;
  windgustLow?: number | string;
  windspeedAvg?: number | string;
  windspeedHigh?: number | string;
  windspeedLow?: number | string;
}

export default class Metric implements IMetric {
  dewptAvg: number | string;
  dewptHigh: number | string;
  dewptLow: number | string;
  heatindexAvg: number | string;
  heatindexHigh: number | string;
  heatindexLow: number | string;
  precipRate: number | string;
  precipTotal: number | string;
  pressureMax: number | string;
  pressureMin: number | string;
  pressureTrend: number | string;
  tempAvg: number | string;
  tempHigh: number | string;
  tempLow: number | string;
  windchillAvg: number | string;
  windchillHigh: number | string;
  windchillLow: number | string;
  windgustAvg: number | string;
  windgustHigh: number | string;
  windgustLow: number | string;
  windspeedAvg: number | string;
  windspeedHigh: number | string;
  windspeedLow: number | string;

  constructor(obj: Partial<IMetric> = {}) {
    this.dewptAvg = obj.dewptAvg ?? "";
    this.dewptHigh = obj.dewptHigh ?? "";
    this.dewptLow = obj.dewptLow ?? "";
    this.heatindexAvg = obj.heatindexAvg ?? "";
    this.heatindexHigh = obj.heatindexHigh ?? "";
    this.heatindexLow = obj.heatindexLow ?? "";
    this.precipRate = obj.precipRate ?? "";
    this.precipTotal = obj.precipTotal ?? "";
    this.pressureMax = obj.pressureMax ?? "";
    this.pressureMin = obj.pressureMin ?? "";
    this.pressureTrend = obj.pressureTrend ?? "";
    this.tempAvg = obj.tempAvg ?? "";
    this.tempHigh = obj.tempHigh ?? "";
    this.tempLow = obj.tempLow ?? "";
    this.windchillAvg = obj.windchillAvg ?? "";
    this.windchillHigh = obj.windchillHigh ?? "";
    this.windchillLow = obj.windchillLow ?? "";
    this.windgustAvg = obj.windgustAvg ?? "";
    this.windgustHigh = obj.windgustHigh ?? "";
    this.windgustLow = obj.windgustLow ?? "";
    this.windspeedAvg = obj.windspeedAvg ?? "";
    this.windspeedHigh = obj.windspeedHigh ?? "";
    this.windspeedLow = obj.windspeedLow ?? "";
  }
}
