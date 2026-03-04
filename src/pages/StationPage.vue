<template>
  <!-- Filtros -->
  <FilterSection
    v-model:selected-station="selectedStation"
    v-model:selected-period="selectedPeriod"
    v-model:selected-day="selectedDay"
    v-model:selected-month="selectedMonth"
    v-model:selected-year="selectedYear"
    :station-names="stationNames"
    :loading="loading"
    @fetch-data="handleFilter"
  />

  <!-- Gráficos -->
  <div class="row q-col-gutter-md fade">
    <!-- Temperatura -->
    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width overflow-hidden">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
            <q-icon name="thermostat" size="xs" class="q-mr-sm" color="red-5" />
            <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
              Variação de Temperatura (°C)
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <apexchart
            height="250"
            :options="chartTimeSerieOptions"
            :series="temperatureSeries"
            ref="temperatureTimeChart"
          ></apexchart>
        </q-card-section>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>

    <!-- Pressão -->
    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width overflow-hidden">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
            <q-icon name="compress" size="xs" class="q-mr-sm" color="blue-grey-5" />
            <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
              Pressão Atmosférica (hPa)
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <apexchart
            height="250"
            :options="chartTimeSerieOptions"
            :series="pressureSeries"
            ref="pressureTimeChart"
          ></apexchart>
        </q-card-section>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>

    <!-- Precipitação -->
    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width overflow-hidden">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
            <q-icon name="ion-rainy" size="xs" class="q-mr-sm" color="indigo-5" />
            <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
              Volume de Precipitação (mm)
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <apexchart
            height="250"
            :options="chartTimeSerieOptions"
            :series="precipitationSeries"
            ref="precipitationTimeChart"
          ></apexchart>
        </q-card-section>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>

    <!-- Vento -->
    <div class="col-12 col-md-6 flex">
      <q-card flat bordered class="full-width overflow-hidden">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
            <q-icon name="air" size="xs" class="q-mr-sm" color="teal-5" />
            <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
              Velocidade do Vento (km/h)
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <apexchart
            height="250"
            :options="chartTimeSerieOptions"
            :series="windSeries"
            ref="windTimeChart"
          >
          </apexchart>
        </q-card-section>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from "vue";
import { STATIONS, TIME_SERIES_CHART_OPTIONS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import FilterSection from "src/components/FilterSection.vue";
import { useObservationStore } from "src/stores/observations";
import { useNotification } from "src/composables/useNotification";
import { useDateRangeSetter } from "src/composables/useDateRangeSetter";
import { SeriesConfig } from "src/types/chart-types";
import { downsampleLTTB, DataPoint } from "src/utils/downsample-utils";

export default defineComponent({
  name: "StationPage",
  components: { FilterSection },

  setup() {
    const store = useObservationStore();
    const { showErrorNotification } = useNotification();

    const {
      getStationPeriodDailyObservations,
      getStationTodayObservations,
      getStationDayObservations,
    } = store;

    const temperatureTimeChart = ref<any>(null);
    const pressureTimeChart = ref<any>(null);
    const precipitationTimeChart = ref<any>(null);
    const windTimeChart = ref<any>(null);

    const loading = ref(false);
    const selectedStation = ref(Object.values(STATIONS)[0]);

    const {
      endDate,
      startDate,
      selectedPeriod,
      selectedYear,
      selectedDay,
      selectedMonth,
      setDatesGivenPeriod,
    } = useDateRangeSetter();

    const chartTimeSerieOptions = ref(TIME_SERIES_CHART_OPTIONS);
    const temperatureSeries = ref([]);
    const pressureSeries = ref([]);
    const precipitationSeries = ref([]);
    const windSeries = ref([]);

    const stationNames = computed(() => Object.values(STATIONS));

    const handleFilter = async () => {
      loading.value = true;
      try {
        setDatesGivenPeriod();
        await fetchStationObservationsData();

        updateGraphs();
      } catch (error: any) {
        console.error(error);
        showErrorNotification(error.message || "Erro ao obter os dados.");
      } finally {
        loading.value = false;
      }
    };

    const fetchStationObservationsData = async () => {
      if (!endDate.value && dataUtils.isToday(startDate.value)) {
        await getStationTodayObservations(selectedStation.value.ID);
      } else if (!endDate.value) {
        await getStationDayObservations(
          selectedStation.value.ID,
          startDate.value
        );
      } else {
        await getStationPeriodDailyObservations(
          selectedStation.value.ID,
          startDate.value,
          endDate.value
        );
      }
    };

    function updateGraphs() {
      updateTemperatureGraph();
      updatePressureGraph();
      updatePrecipitationGraph();
      updateWindGraph();
    }

    const updateGraphOptions = (
      chartRef: any,
      seriesMap: SeriesConfig,
      colors: string[]
    ) => {
      const data = Object.keys(seriesMap).map((serie) => {
        const name = seriesMap[serie].desc;
        const rawData: DataPoint[] = store.stationObservations
          .filter((obs) => obs.metric && (obs.metric as any)[serie] !== undefined && (obs.metric as any)[serie] !== "")
          .map((obs) => [
            dataUtils.subtractHours(new Date(obs.obsTimeLocal as string), 3),
            Number((obs.metric as any)[serie]),
          ]);

        // Downsample if more than 500 points
        const finalData = downsampleLTTB(rawData, 500);

        return {
          name,
          data: finalData,
        };
      });

      chartRef.value.updateOptions({
        series: data,
        yaxis: {},
        colors,
      });
    };

    const updateTemperatureGraph = () => {
      const tempMap: SeriesConfig = {
        tempAvg: { desc: "Média", color: "yellow" },
        tempHigh: { desc: "Máxima", color: "red" },
        tempLow: { desc: "Mínima", color: "blue" },
      };
      updateGraphOptions(temperatureTimeChart, tempMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    const updatePressureGraph = () => {
      const pressurePropsMap: SeriesConfig = {
        pressureMin: { desc: "Mínima", color: "blue" },
        pressureMax: { desc: "Máxima", color: "red" },
      };

      updateGraphOptions(pressureTimeChart, pressurePropsMap, [
        "#6495ED",
        "#FF5733",
      ]);
    };

    const updatePrecipitationGraph = () => {
      const precipPropsMap: SeriesConfig = {
        precipRate: { desc: "Taxa (mm/h)", color: "yellow" },
        precipTotal: { desc: "Total", color: "blue" },
      };

      updateGraphOptions(precipitationTimeChart, precipPropsMap, [
        "#FFD700",
        "#6495ED",
      ]);
    };

    const updateWindGraph = () => {
      const windPropsMap: SeriesConfig = {
        windspeedAvg: { desc: "Média", color: "yellow" },
        windspeedHigh: { desc: "Máxima", color: "red" },
        windspeedLow: { desc: "Mínima", color: "blue" },
      };

      updateGraphOptions(windTimeChart, windPropsMap, [
        "#FFD700",
        "#FF5733",
        "#6495ED",
      ]);
    };

    onMounted(async () => {
      await handleFilter();
    });

    return {
      temperatureTimeChart,
      pressureTimeChart,
      precipitationTimeChart,
      windTimeChart,
      loading,
      selectedStation,
      selectedPeriod,
      selectedDay,
      selectedMonth,
      selectedYear,
      chartTimeSerieOptions,
      temperatureSeries,
      pressureSeries,
      precipitationSeries,
      windSeries,
      stationNames,
      handleFilter,
    };
  },
});
</script>

<style lang="scss" scoped>
// Using global styles for dark-header, border-bottom, letter-spacing-1, etc.
</style>
