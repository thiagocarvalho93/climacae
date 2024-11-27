export class WeatherStation {
  constructor(
    stationId,
    maxTemp,
    maxTempTime,
    minTemp,
    minTempTime,
    maxWind,
    maxWindTime,
    maxPrecipitation,
    maxPrecipitationTime,
    totalPrecipitation,
    totalPrecipitationTime
  ) {
    this.stationId = stationId;
    this.maxTemp = maxTemp;
    this.maxTempTime = maxTempTime;
    this.minTemp = minTemp;
    this.minTempTime = minTempTime;
    this.maxWind = maxWind;
    this.maxWindTime = maxWindTime;
    this.maxPrecipitation = maxPrecipitation;
    this.maxPrecipitationTime = maxPrecipitationTime;
    this.totalPrecipitation = totalPrecipitation;
    this.totalPrecipitationTime = totalPrecipitationTime;
  }
}

export class WeatherData {
  constructor(value, station, obsTimeLocal) {
    this.value = value;
    this.station = station;
    this.obsTimeLocal = obsTimeLocal;
  }
}

export class WeatherReport {
  constructor(
    stations,
    maxTemp,
    minTemp,
    maxWind,
    maxPrecipitation,
    totalPrecipitation
  ) {
    this.stations = stations;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
    this.maxWind = maxWind;
    this.maxPrecipitation = maxPrecipitation;
    this.totalPrecipitation = totalPrecipitation;
  }

  static fromJson(json) {
    const stations = json.stations.map(
      (stationData) =>
        new WeatherStation(
          stationData.stationId,
          stationData.maxTemp,
          stationData.maxTempTime,
          stationData.minTemp,
          stationData.minTempTime,
          stationData.maxWind,
          stationData.maxWindTime,
          stationData.maxPrecipitation,
          stationData.maxPrecipitationTime,
          stationData.totalPrecipitation,
          stationData.totalPrecipitationTime
        )
    );

    const maxTemp = new WeatherData(
      json.maxTemp.value,
      json.maxTemp.station,
      json.maxTemp.obsTimeLocal
    );
    const minTemp = new WeatherData(
      json.minTemp.value,
      json.minTemp.station,
      json.minTemp.obsTimeLocal
    );
    const maxWind = new WeatherData(
      json.maxWind.value,
      json.maxWind.station,
      json.maxWind.obsTimeLocal
    );
    const maxPrecipitation = new WeatherData(
      json.maxPrecipitation.value,
      json.maxPrecipitation.station,
      json.maxPrecipitation.obsTimeLocal
    );
    const totalPrecipitation = new WeatherData(
      json.totalPrecipitation.value,
      json.totalPrecipitation.station,
      json.totalPrecipitation.obsTimeLocal
    );

    return new WeatherReport(
      stations,
      maxTemp,
      minTemp,
      maxWind,
      maxPrecipitation,
      totalPrecipitation
    );
  }
}
