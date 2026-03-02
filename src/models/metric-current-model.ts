export interface IMetricCurrent {
  dewpt?: number | string;
  elev?: number | string;
  heatIndex?: number | string;
  precipRate?: number | string;
  precipTotal?: number | string;
  pressure32?: number | string;
  temp?: number | string;
  windChill?: number | string;
  windGust?: number | string;
  windSpeed?: number | string;
}

export default class MetricCurrent implements IMetricCurrent {
  dewpt: number | string;
  elev: number | string;
  heatIndex: number | string;
  precipRate: number | string;
  precipTotal: number | string;
  pressure32: number | string;
  temp: number | string;
  windChill: number | string;
  windGust: number | string;
  windSpeed: number | string;

  constructor(obj: Partial<IMetricCurrent> = {}) {
    this.dewpt = obj.dewpt ?? "";
    this.elev = obj.elev ?? "";
    this.heatIndex = obj.heatIndex ?? "";
    this.precipRate = obj.precipRate ?? "";
    this.precipTotal = obj.precipTotal ?? "";
    this.pressure32 = obj.pressure32 ?? "";
    this.temp = obj.temp ?? "";
    this.windChill = obj.windChill ?? "";
    this.windGust = obj.windGust ?? "";
    this.windSpeed = obj.windSpeed ?? "";
  }
}
