import { PERIODOS } from "src/constants/constants";
import dataUtils from "./data-utils";
import Metric from "src/models/metric-model";

/**
 * Converts an array of data rows to a CSV string.
 *
 * @param {Array<Object>} rows - The data rows to be converted to CSV format.
 * @returns {string} The CSV string.
 */
const getCsvString = (rows) => {
  const props = [
    "obsTimeLocal",
    "stationID",
    "humidityAvg",
    "humidityHigh",
    "humidityLow",
    "winddirAvg",
  ];
  const metricProps = Object.keys(new Metric());

  const header = [...props, ...metricProps].join(",");

  const csvRows = rows.map((row) => {
    const rowValues = [
      ...props.map((prop) => row[prop] ?? ""),
      ...metricProps.map((prop) => row.metric[prop] ?? ""),
    ];
    return rowValues.join(",");
  });

  return [header, ...csvRows].join("\n");
};

/**
 * Generates a CSV file name based on the selected period and date range.
 *
 * @param {string} selectedPeriod - The selected period identifier (e.g., "HOJE").
 * @param {Date} startDate - The start date of the period.
 * @param {Date} endDate - The end date of the period.
 * @returns {string} - The formatted CSV file name, with dates formatted as `startDate.csv` for single-day periods,
 *                     or `startDate-endDate.csv` for multi-day periods.
 */
const getCsvFileName = (selectedPeriod, startDate, endDate) => {
  const formatedStartDate = dataUtils.formatarDataComUnderline(startDate);
  const formatedEndDate = dataUtils.formatarDataComUnderline(endDate);

  if (selectedPeriod === PERIODOS.HOJE) {
    return `${formatedStartDate}.csv`;
  }
  return `${formatedStartDate}-${formatedEndDate}.csv`;
};

/**
 * Downloads a CSV file with the specified filename and content.
 *
 * @async
 * @param {string} fileName - The name to be used for the downloaded CSV file.
 * @param {string} csvString - The CSV content as a string to be saved in the file.
 *
 * @returns {Promise<void>} - A promise that resolves when the download process completes.
 *
 * @throws Will log an error if file saving fails.
 */
const downloadCsv = async (fileName, csvString) => {
  try {
    const opcoes = {
      types: [
        {
          description: "CSV",
          accept: { "text/csv": [".csv"] },
        },
      ],
      suggestedName: fileName,
    };

    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker(opcoes);
      const writable = await handle.createWritable();
      await writable.write(csvString);
      await writable.close();
    } else {
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.csv`;
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
  downloadCsv,
  getCsvString,
  getCsvFileName,
};
