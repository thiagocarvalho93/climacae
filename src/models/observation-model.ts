import Metric, { IMetric } from "./metric-model";

export interface IObservation {
  epoch?: number | string;
  humidityAvg?: number | string;
  humidityHigh?: number | string;
  humidityLow?: number | string;
  lat?: number | string;
  lon?: number | string;
  metric?: IMetric;
  obsTimeLocal?: string;
  obsTimeUtc?: string;
  qcStatus?: number | string;
  solarRadiationHigh?: number | string;
  stationID?: string;
  tz?: string;
  uvHigh?: number | string;
  winddirAvg?: number | string;
}

export default class Observation implements IObservation {
  epoch: number | string;
  humidityAvg: number | string;
  humidityHigh: number | string;
  humidityLow: number | string;
  lat: number | string;
  lon: number | string;
  metric: Metric;
  obsTimeLocal: string;
  obsTimeUtc: string;
  qcStatus: number | string;
  solarRadiationHigh: number | string;
  stationID: string;
  tz: string;
  uvHigh: number | string;
  winddirAvg: number | string;

  constructor(obj: Partial<IObservation> = {}) {
    this.epoch = obj.epoch ?? "";
    this.humidityAvg = obj.humidityAvg ?? "";
    this.humidityHigh = obj.humidityHigh ?? "";
    this.humidityLow = obj.humidityLow ?? "";
    this.lat = obj.lat ?? "";
    this.lon = obj.lon ?? "";
    this.metric = obj.metric ? new Metric(obj.metric) : new Metric();
    this.obsTimeLocal = obj.obsTimeLocal ?? "";
    this.obsTimeUtc = obj.obsTimeUtc ?? "";
    this.qcStatus = obj.qcStatus ?? "";
    this.solarRadiationHigh = obj.solarRadiationHigh ?? 0;
    this.stationID = obj.stationID ?? "";
    this.tz = obj.tz ?? "";
    this.uvHigh = obj.uvHigh ?? 0;
    this.winddirAvg = obj.winddirAvg ?? "";
  }
}
