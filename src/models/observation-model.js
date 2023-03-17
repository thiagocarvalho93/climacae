import Metric from "./metric-model";

export default class Observation {
  constructor(obj) {
    obj = obj || {};
    this.epoch = obj.epoch || "";
    this.humidityAvg = obj.humidityAvg || "";
    this.humidityHigh = obj.humidityHigh || "";
    this.humidityLow = obj.humidityLow || "";
    this.lat = obj.lat || "";
    this.lon = obj.lon || "";
    this.metric = obj.metric ? new Metric(obj.metric) : new Metric();
    this.obsTimeLocal = obj.obsTimeLocal || "";
    this.obsTimeUtc = obj.obsTimeUtc || "";
    this.qcStatus = obj.qcStatus || "";
    this.solarRadiationHigh = obj.solarRadiationHigh || "";
    this.stationID = obj.stationID || "";
    this.tz = obj.tz || "";
    this.uvHigh = obj.uvHigh || "";
    this.winddirAvg = obj.winddirAvg || "";
  }
}
