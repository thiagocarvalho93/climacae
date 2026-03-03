import arrayUtils from "src/utils/array-utils";
import dataUtils from "src/utils/data-utils";

export interface StationInfo {
  ID: string;
  NAME: string;
}

export interface Stations {
  [key: string]: StationInfo;
}

const STATIONS: Stations = {
  IMACA6: { ID: "IMACA6", NAME: "Mirante 1" },
  IMACA7: { ID: "IMACA7", NAME: "Mirante 2" },
  IMACA13: { ID: "IMACA13", NAME: "Glicério" },
  // IMACA15: { ID: "IMACA15", NAME: "Glória" },
  // IMACA23: { ID: "IMACA23", NAME: "Imboassica" },
  // IMACA26: { ID: "IMACA26", NAME: "Granja dos Cavaleiros" },
  // IMACA27: { ID: "IMACA27", NAME: "Imbetiba" },
  // IMACA28: { ID: "IMACA28", NAME: "Aroeira" },
  IMACA30: { ID: "IMACA30", NAME: "Imboassica" },
  IMACA31: { ID: "IMACA31", NAME: "Botafogo" },
  IMACA32: { ID: "IMACA32", NAME: "Visconde" },
  IMACA36: { ID: "IMACA36", NAME: "Córrego do Ouro" },
  // IMACA41: { ID: "IMACA41", NAME: "Lagomar" },
  IMACA42: { ID: "IMACA42", NAME: "Virgem Santa" },
  IMACA43: { ID: "IMACA43", NAME: "Aeroporto" },
  IMACA44: { ID: "IMACA44", NAME: "Cavaleiros" },
  // IMACA46: { ID: "IMACA46", NAME: "Cajueiros" },
  IMACA52: { ID: "IMACA52", NAME: "Barreto" },
  IMACA53: { ID: "IMACA53", NAME: "Sana" },
  IMACA54: { ID: "IMACA54", NAME: "Cabiúnas" },
  IMACA56: { ID: "IMACA56", NAME: "Praia do Pecado" },
  IMACA58: { ID: "IMACA58", NAME: "Barra" },
};

const COLORS = {
  BLUE: "#1565c0",
  RED: "#f44336",
  INDIGO: "#3f51b5",
  INDIGO_LIGHT: "#7986CB",
  INDIGO_DARK: "#1a237e",
};

/**
 * Filter period options.
 */
const PERIODS = {
  TODAY: "Hoje",
  LAST_72_HOURS: "Últimas 72h",
  LAST_7_DAYS: "Últimos 7 dias",
  LAST_30_DAYS: "Últimos 30 dias",
  SPECIFIC_DAY: "Dia específico",
  SPECIFIC_MONTH: "Mês específico",
};

// TODO: This option should be dynamic based on the selected month!
const DAY_OPTIONS: number[] = (arrayUtils as any).arrayRange(
  1,
  dataUtils.calculateCurrentMonthDay(),
  1
);

/**
 * Array from 1 to 12.
 */
const MONTH_OPTIONS: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Array from 2020 to current year.
 */
const YEAR_OPTIONS: number[] = (arrayUtils as any).arrayRange(
  2020,
  new Date().getFullYear(),
  1
);

// CHARTS
const TEMPERATURE_CHART_OPTIONS = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "45%",
      borderRadius: 2,
      borderRadiusApplication: "end",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    strokeDashArray: 6,
  },
  xaxis: {
    categories: Object.keys(STATIONS),
  },
  yaxis: {
    min: 10,
    tickAmount: 5,
  },

  tooltip: {
    y: {
      formatter: function (value: number) {
        return value.toFixed(1) + "°C";
      },
    },
  },
};

const PRECIPITATION_CHART_OPTIONS = {
  chart: {
    type: "bar",
    stacked: true,
    height: 350,
  },
  plotOptions: {
    bar: {
      borderRadius: 3,
      borderRadiusWhenStacked: "last",
      borderRadiusApplication: "end",
      horizontal: true,
      stacked: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 12,
          offsetY: 6,
          style: {
            fontSize: "12px",
            fontWeight: 800,
          },
          formatter: function (val: number) {
            return val.toFixed(1) + " mm";
          },
        },
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    strokeDashArray: 7,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: Object.keys(STATIONS),
  },
  tooltip: {
    y: {
      formatter: (texto: number) => {
        return `${texto.toFixed(1)} mm`;
      },
    },
  },
};

const TIME_SERIES_CHART_OPTIONS = Object.freeze({
  chart: {
    type: "line",
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout" as const,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 3,
    curve: "smooth" as const,
  },
  legend: {
    show: true,
  },
  grid: {
    row: {
      colors: ["#e5e5e5", "transparent"],
      opacity: 0.5,
    },
    column: {
      colors: ["#f8f8f8", "transparent"],
    },
    borderColor: "#e5e5e5",
    strokeDashArray: 7,
  },
  xaxis: {
    type: "datetime" as const,
    tickAmount: 8,
  },
  yaxis: {
    min: 15,
    max: 40,
  },
});

const TABLE_COLUMNS = [
  {
    name: "data",
    required: true,
    label: "Data",
    align: "left" as const,
    field: (row: any) => row.obsTimeLocal,
    format: (val: string) => `${new Date(val).toLocaleDateString()}`,
    sortable: true,
    style: "width: 50px",
  },
  {
    name: "hora",
    required: true,
    label: "Hora",
    align: "left" as const,
    field: (row: any) => row.obsTimeLocal,
    format: (val: string) =>
      `${new Date(val).toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    sortable: true,
    style: "width: 50px",
  },
  {
    name: "idEstacao",
    align: "left" as const,
    label: "ID estação",
    field: (row: any) => row.stationID,
    sortable: true,
    style: "width: 50px",
  },
  {
    name: "estacao",
    align: "left" as const,
    label: "Local",
    field: (row: any) => STATIONS[row.stationID]?.NAME || "N/A",
    sortable: true,
  },
  {
    name: "max",
    label: "Máxima (°C)",
    field: (row: any) => row.metric.tempHigh,
    sortable: true,
    align: "left" as const,
  },
  {
    name: "min",
    label: "Mínima (°C)",
    field: (row: any) => row.metric.tempLow,
    sortable: true,
    align: "left" as const,
  },
  {
    name: "humid",
    label: "Umidade (%)",
    field: (row: any) => row.humidityAvg,
    sortable: true,
    align: "left" as const,
  },
  {
    name: "precipitacao",
    label: "Precipitação (mm)",
    field: (row: any) => row.metric.precipTotal,
    sortable: true,
    align: "left" as const,
  },
  {
    name: "gustHigh",
    label: "Vento máximo (km/h)",
    field: (row: any) => row.metric.windgustHigh,
    sortable: true,
    align: "left" as const,
  },
];

export {
  STATIONS,
  COLORS,
  PERIODS,
  DAY_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
  TEMPERATURE_CHART_OPTIONS,
  PRECIPITATION_CHART_OPTIONS,
  TIME_SERIES_CHART_OPTIONS,
  TABLE_COLUMNS,
};
