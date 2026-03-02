export interface SeriesConfig {
  [key: string]: { desc: string; color: string };
}

export interface ChartSeries {
  name: string;
  data: [Date, number | string | undefined][];
}
