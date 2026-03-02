import MetricCurrent, { IMetricCurrent } from "./metric-current-model";

export interface IObservationCurrent {
  country?: string;
  epoch?: number | string;
  humidity?: number | string;
  lat?: number | string;
  lon?: number | string;
  metric?: IMetricCurrent;
  neighborhood?: string;
  obsTimeLocal?: string;
  obsTimeUtc?: string;
  qcStatus?: number | string;
  realtimeFrequency?: number | string;
  softwareType?: string;
  solarRadiation?: number | string;
  stationID?: string;
  uv?: number | string;
  winddir?: number | string;
}

export default class ObservationCurrent implements IObservationCurrent {
  country: string;
  epoch: number | string;
  humidity: number | string;
  lat: number | string;
  lon: number | string;
  metric: MetricCurrent;
  neighborhood: string;
  obsTimeLocal: string;
  obsTimeUtc: string;
  qcStatus: number | string;
  realtimeFrequency: number | string;
  softwareType: string;
  solarRadiation: number | string;
  stationID: string;
  uv: number | string;
  winddir: number | string;

  constructor(obj: Partial<IObservationCurrent> = {}) {
    this.country = obj.country ?? "";
    this.epoch = obj.epoch ?? "";
    this.humidity = obj.humidity ?? "";
    this.lat = obj.lat ?? "";
    this.lon = obj.lon ?? "";
    this.metric = obj.metric
      ? new MetricCurrent(obj.metric)
      : new MetricCurrent();
    this.neighborhood = obj.neighborhood ?? "";
    this.obsTimeLocal = obj.obsTimeLocal ?? "";
    this.obsTimeUtc = obj.obsTimeUtc ?? "";
    this.qcStatus = obj.qcStatus ?? "";
    this.realtimeFrequency = obj.realtimeFrequency ?? "";
    this.softwareType = obj.softwareType ?? "";
    this.solarRadiation = obj.solarRadiation ?? "";
    this.stationID = obj.stationID ?? "";
    this.uv = obj.uv ?? "";
    this.winddir = obj.winddir ?? "";
  }
}
