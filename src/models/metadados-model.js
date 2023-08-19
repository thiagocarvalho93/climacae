import Observation from "./observation-model";

export default class MetadadosModel {
  constructor(obj) {
    obj = obj ?? {};
    this.stationID = obj.stationID;
    this.tempHigh = obj.tempHigh;
    this.tempHighObs = new Observation(obj.tempHighObs) ?? new Observation();
    this.tempLow = obj.tempLow;
    this.tempLowObs = new Observation(obj.tempLowObs) ?? new Observation();
    this.windgustHigh = obj.windgustHigh;
    this.windgustHighObs =
      new Observation(obj.obsVentoMaximo) ?? new Observation();
    this.precipTotal = obj.precipTotal;
    this.precipTotalObs =
      new Observation(obj.precipTotalObs) ?? new Observation();
  }

  parseFromMetric(metricModel) {
    this.tempHigh = metricModel.tempHigh;
    this.tempLow = metricModel.tempLow;
    this.windgustHigh = metricModel.windgustHigh;
    this.precipTotal = metricModel.precipTotal;
  }
}
