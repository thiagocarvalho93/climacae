export default class Metric {
  constructor(obj) {
    obj = obj || {};
    this.dewptAvg = obj.dewptAvg || "";
    this.dewptHigh = obj.dewptHigh || "";
    this.dewptLow = obj.dewptLow || "";
    this.heatindexAvg = obj.heatindexAvg || "";
    this.heatindexHigh = obj.heatindexHigh || "";
    this.heatindexLow = obj.heatindexLow || "";
    this.precipRate = obj.precipRate || "";
    this.precipTotal = obj.precipTotal || "";
    this.pressureMax = obj.pressureMax || "";
    this.pressureMin = obj.pressureMin || "";
    this.pressureTrend = obj.pressureTrend || "";
    this.tempAvg = obj.tempAvg || "";
    this.tempHigh = obj.tempHigh || "";
    this.tempLow = obj.tempLow || "";
    this.windchillAvg = obj.windchillAvg || "";
    this.windchillHigh = obj.windchillHigh || "";
    this.windchillLow = obj.windchillLow || "";
    this.windgustAvg = obj.windgustAvg || "";
    this.windgustHigh = obj.windgustHigh || "";
    this.windgustLow = obj.windgustLow || "";
    this.windspeedAvg = obj.windspeedAvg || "";
    this.windspeedHigh = obj.windspeedHigh || "";
    this.windspeedLow = obj.windspeedLow || "";
  }
}
