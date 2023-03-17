import MetricCurrent from "./metric-current-model";

export default class ObservationCurrent {
  constructor(obj) {
    this.obj = obj || {};
    this.country = obj.country || "";
    this.epoch = obj.epoch || "";
    this.humidity = obj.humidity || "";
    this.lat = obj.lat || "";
    this.lon = obj.lon || "";
    this.metric = obj.metric
      ? new MetricCurrent(obj.metric)
      : new MetricCurrent();
    this.neighborhood = obj.neighborhood || "";
    this.obsTimeLocal = obj.obsTimeLocal || "";
    this.obsTimeUtc = obj.obsTimeUtc || "";
    this.qcStatus = obj.qcStatus || "";
    this.realtimeFrequency = obj.realtimeFrequency || "";
    this.softwareType = obj.softwareType || "";
    this.solarRadiation = obj.solarRadiation || "";
    this.stationID = obj.stationID || "";
    this.uv = obj.uv || "";
    this.winddir = obj.winddir || "";
  }
}
