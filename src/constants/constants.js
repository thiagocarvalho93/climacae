const STATIONS = {
  // IRIODA1: { ID: "IRIODA1", NOME: "RO - Alphaville" },
  // IRIODA5: { ID: "IRIODA5", NOME: "RO - Parque dos Pássaros" },
  // IRIODA6: { ID: "IRIODA6", NOME: "Canta Galo" },
  IMACA7: { ID: "IMACA7", NOME: "Mirante" },
  IMACA13: { ID: "IMACA13", NOME: "Serra" },
  IMACA15: { ID: "IMACA15", NOME: "Glória" },
  // IMACA23: { ID: "IMACA23", NOME: "" }, desativada
  IMACA26: { ID: "IMACA26", NOME: "Granja dos Cavaleiros" },
  IMACA27: { ID: "IMACA27", NOME: "Imbetiba" },
  IMACA28: { ID: "IMACA28", NOME: "Aroeira" },
  IMACA30: { ID: "IMACA30", NOME: "Imboassica" },
  IMACA31: { ID: "IMACA31", NOME: "Botafogo" },
  IMACA32: { ID: "IMACA32", NOME: "Visconde" },
  IMACA36: { ID: "IMACA36", NOME: "Córrego do Ouro" },
  // ICAMPO96: { ID: "ICAMPO96", NOME: "" }, desativada
  // ICAMPO223: { ID: "ICAMPO223", NOME: "" },
  // ICABOF4: { ID: "ICABOF4", NOME: "Cabo Frio" },
};

const CORES = {
  AZUL: "#1565c0",
  VERMELHO: "#f44336",
  INDIGO: "#3f51b5",
  INDIGO_CLARO: "#7986CB",
  INDIGO_ESCURO: "#1a237e",
};

const PERIODOS = {
  HOJE: "Hoje",
  ULTIMOS_SETE_DIAS: "Últimos 7 dias",
  ULTIMOS_TRINTA_DIAS: "Últimos 30 dias",
  DIA_ESPECIFICO: "Dia específico",
  MES_ESPECIFICO: "Mês específico",
};

// GRÁFICOS
const CHART_TEMPERATURA_OPTIONS = {
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
    max: 40,
    tickAmount: 5,
  },

  tooltip: {
    y: {
      formatter: function (value) {
        return value.toFixed(1) + "°C";
      },
    },
  },
};

const CHART_PRECIPITACAO_OPTIONS = {
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
          formatter: function (val) {
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
};

const CHART_SERIE_TEMPORAL_OPTIONS = {
  chart: {
    type: "line",
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
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
    curve: "smooth",
  },
  grid: {
    row: {
      opacity: 0.5,
    },
  },
  xaxis: {
    type: "datetime",
    tickAmount: 8,
  },
  yaxis: {
    min: 5,
    max: 40,
  },
};

export {
  STATIONS,
  CORES,
  PERIODOS,
  CHART_TEMPERATURA_OPTIONS,
  CHART_PRECIPITACAO_OPTIONS,
  CHART_SERIE_TEMPORAL_OPTIONS,
};
