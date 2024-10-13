import { PERIODOS } from "src/constants/constants";
import dataUtils from "./data-utils";
import Metric from "src/models/metric-model";

const montarCsv = (linhas) => {
  let props = [
    "obsTimeLocal",
    "stationID",
    "humidityAvg",
    "humidityHigh",
    "humidityLow",
    "winddirAvg",
  ];

  let csvString = "";
  csvString += props.join(",");
  csvString += ",";
  csvString += Object.keys(new Metric()).join(",");
  csvString += "\n";

  for (const linha of linhas) {
    csvString += props.map((prop) => linha[prop]).join(",");
    csvString += ",";
    csvString += Object.values(linha.metric).join(",");
    csvString += "\n";
  }

  return csvString;
};

const definirNomeCSV = (periodoSelecionado, dataInicial, dataFinal) => {
  const dataInicialFormatada = dataUtils.formatarDataParaCsv(dataInicial);
  const dataFinalFormatada = dataUtils.formatarDataParaCsv(dataFinal);

  if (periodoSelecionado === PERIODOS.HOJE) {
    return `${dataInicialFormatada}.csv`;
  }
  return `${dataInicialFormatada}-${dataFinalFormatada}.csv`;
};

const baixarCsv = async (nome, csv) => {
  try {
    const opcoes = {
      types: [
        {
          description: "CSV",
          accept: { "text/csv": [".csv"] },
        },
      ],
      suggestedName: nome,
    };

    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker(opcoes);
      const writable = await handle.createWritable();
      await writable.write(csv);
      await writable.close();
    } else {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nome}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error("Error saving the CSV file:", err);
  }
};

export default {
  baixarCsv,
  montarCsv,
  definirNomeCSV,
};
