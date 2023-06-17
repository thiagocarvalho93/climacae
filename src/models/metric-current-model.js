export default class MetricCurrent {
  constructor(obj) {
    obj = obj ?? {};
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
