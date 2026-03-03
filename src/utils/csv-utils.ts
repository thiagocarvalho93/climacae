import { PERIODOS } from "src/constants/constants";
import dataUtils from "./data-utils";
import Metric from "src/models/metric-model";
import { IObservation } from "src/models/observation-model";

/**
 * Converts an array of data rows to a CSV string.
 *
 * @param {IObservation[]} rows - The data rows to be converted to CSV format.
 * @returns {string} The CSV string.
 */
const getCsvString = (rows: IObservation[]): string => {
  const props: (keyof IObservation)[] = [
    "obsTimeLocal",
    "stationID",
    "humidityAvg",
    "humidityHigh",
    "humidityLow",
    "winddirAvg",
  ];
  const metricSample = new Metric();
  const metricProps = Object.keys(metricSample) as (keyof Metric)[];

  const header = [...props, ...metricProps].join(",");

  const csvRows = rows.map((row) => {
    const rowValues = [
      ...props.map((prop) => (row[prop] !== undefined ? row[prop] : "")),
      ...metricProps.map((prop) =>
        row.metric && row.metric[prop] !== undefined ? row.metric[prop] : ""
      ),
    ];
    return rowValues.join(",");
  });

  return [header, ...csvRows].join("\n");
};

/**
 * Generates a CSV file name based on the selected period and date range.
 *
 * @param {string} selectedPeriod - The selected period identifier (e.g., "HOJE").
 * @param {Date | null} startDate - The start date of the period.
 * @param {Date | null} endDate - The end date of the period.
 * @returns {string} - The formatted CSV file name.
 */
const getCsvFileName = (
  selectedPeriod: string,
  startDate: Date | null,
  endDate: Date | null
): string => {
  const formattedStartDate = startDate
    ? dataUtils.formatDateWithUnderline(startDate)
    : "start_date";
  const formattedEndDate = endDate
    ? dataUtils.formatDateWithUnderline(endDate)
    : "end_date";

  if (selectedPeriod === PERIODOS.HOJE) {
    return `${formattedStartDate}.csv`;
  }
  return `${formattedStartDate}-${formattedEndDate}.csv`;
};

/**
 * Downloads a CSV file with the specified filename and content.
 *
 * @async
 * @param {string} fileName - The name to be used for the downloaded CSV file.
 * @param {string} csvString - The CSV content as a string to be saved in the file.
 *
 * @returns {Promise<void>} - A promise that resolves when the download process completes.
 */
const downloadCsv = async (
  fileName: string,
  csvString: string
): Promise<void> => {
  try {
    const options = {
      types: [
        {
          description: "CSV",
          accept: { "text/csv": [".csv"] } as Record<string, string[]>,
        },
      ],
      suggestedName: fileName,
    };

    if ("showSaveFilePicker" in window) {
      const handle = await (window as any).showSaveFilePicker(options);
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
