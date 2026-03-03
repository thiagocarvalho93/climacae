<template>
  <!-- Filtros -->
  <FilterSection
    v-model:selected-period="selectedPeriod"
    v-model:selected-day="selectedDay"
    v-model:selected-month="selectedMonth"
    v-model:selected-year="selectedYear"
    :loading="loading"
    @fetchData="handleFilter"
  />

  <!-- Cards -->
  <div class="row q-col-gutter-md fade">
    <div class="col-12 col-sm-6 col-md-3">
      <InfoCard
        :loading="loading"
        title="MÁXIMA"
        :description="`${maxValues.maxima}°C`"
        icon="thermostat"
        icon-color="red-5"
        :back-title="formatCardTitle(maxValues.dadosMaxima)"
        :back-description="formatCardDate(maxValues.dadosMaxima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InfoCard
        :loading="loading"
        title="MÍNIMA"
        :description="`${maxValues.minima}°C`"
        icon="thermostat"
        icon-color="blue-5"
        :back-title="formatCardTitle(maxValues.dadosMinima)"
        :back-description="formatCardDate(maxValues.dadosMinima)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InfoCard
        :loading="loading"
        title="VENTO MÁXIMO"
        :description="`${maxValues.ventoMaximo} km/h`"
        icon="wind_power"
        icon-color="green-5"
        :back-title="formatCardTitle(maxValues.dadosVentoMaximo)"
        :back-description="formatCardDate(maxValues.dadosVentoMaximo)"
      />
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <InfoCard
        :loading="loading"
        title="PRECIPITAÇÃO MÁXIMA"
        :description="`${maxValues.precipitacaoMaxima}mm`"
        icon="ion-rainy"
        icon-color="deep-purple-5"
        :back-title="formatCardTitle(maxValues.dadosPrecipitacaoMaxima)"
        :back-description="formatCardDate(maxValues.dadosPrecipitacaoMaxima)"
      />
    </div>

    <!-- Carrocel -->
    <div class="col-12 col-md-3 flex">
      <RealTimeObservationsCarousel
        :stations="stations"
        :dark-mode="darkMode"
      />
    </div>

    <!-- Gráficos -->
    <div class="col-12 col-md-9 flex">
      <GeneralTemperatureChart :loading="loading" ref="temperatureChart" />
    </div>

    <div class="col-12 col-sm-5 flex">
      <GeneralPrecipitationChart
        :loading="loading"
        :selected-period="selectedPeriod"
        ref="precipitationChart"
      />
    </div>

    <div class="col-12 col-sm-7 flex">
      <StationsMap />
    </div>

    <!-- Tabela -->
    <div class="col-12">
      <ObservationsTable
        :rows="observations"
        :columns="tableColumns"
        :loading="loading"
        :end-date="endDate"
        :start-date="startDate"
        :selected-period="selectedPeriod"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from "vue";
import { useObservationStore } from "src/stores/observations";
import { STATIONS, TABLE_COLUMNS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import { useQuasar } from "quasar";
import RealTimeObservationsCarousel from "src/components/RealTimeObservationsCarousel.vue";
import InfoCard from "src/components/InfoCard.vue";
import ObservationsTable from "src/components/ObservationsTable.vue";
import FilterSection from "src/components/FilterSection.vue";
import GeneralTemperatureChart from "src/components/GeneralTemperatureChart.vue";
import GeneralPrecipitationChart from "src/components/GeneralPrecipitationChart.vue";
import StationsMap from "src/components/StationsMap.vue";
import { useNotification } from "src/composables/useNotification";
import { useDateRangeSetter } from "src/composables/useDateRangeSetter";
import { IObservation } from "src/models/observation-model";

export default defineComponent({
  name: "IndexPage",
  components: {
    RealTimeObservationsCarousel,
    InfoCard,
    ObservationsTable,
    FilterSection,
    GeneralTemperatureChart,
    GeneralPrecipitationChart,
    StationsMap,
  },
  setup() {
    const $q = useQuasar();
    const observationStore = useObservationStore();
    const { showErrorNotification } = useNotification();

    const loading = ref(true);

    const {
      endDate,
      startDate,
      selectedPeriod,
      selectedYear,
      selectedDay,
      selectedMonth,
      setDatesGivenPeriod,
    } = useDateRangeSetter();

    const temperatureChart = ref<any>(null);
    const precipitationChart = ref<any>(null);

    const observations = computed(() => observationStore.observations);
    const maxValues = computed(() => observationStore.maxValues);
    const darkMode = computed(() => $q.dark.isActive);
    const stations = computed(() => STATIONS);
    const stationIds = computed(() => Object.keys(STATIONS));
    const tableColumns = computed(() => TABLE_COLUMNS);

    const handleFilter = async () => {
      loading.value = true;

      try {
        setDatesGivenPeriod();
        await fetchObservationsData();
        updateGraphs();
      } catch (error: any) {
        showErrorNotification(error?.message || "Erro ao obter os dados.");
      } finally {
        loading.value = false;
      }
    };

    const fetchObservationsData = async () => {
      if (!endDate.value && dataUtils.isToday(startDate.value)) {
        await observationStore.getTodayObservations(stationIds.value);
      } else if (!endDate.value) {
        await observationStore.getSpecificDayObservations(
          stationIds.value,
          startDate.value
        );
      } else {
        await observationStore.getPeriodDailyObservations(
          stationIds.value,
          startDate.value,
          endDate.value
        );
      }
    };

    function updateGraphs() {
      temperatureChart.value?.update();
      precipitationChart.value?.update();
    }

    const formatCardDate = (dados: IObservation | null) => {
      if (!dados || !dados.obsTimeLocal) return "N/A";
      return new Date(dados.obsTimeLocal).toLocaleDateString();
    };

    const formatCardTitle = (dados: IObservation | null) => {
      if (!dados || !dados.stationID) return "Sem dados";

      const idEstacao = dados.stationID;
      const estacao = (stations.value as any)[idEstacao];
      return `Em ${estacao?.NAME} (${idEstacao})`;
    };

    onMounted(() => {
      handleFilter();
    });

    return {
      loading,
      selectedPeriod,
      selectedDay,
      selectedMonth,
      selectedYear,
      startDate,
      endDate,
      observations,
      maxValues,
      darkMode,
      stations,
      stationIds,
      tableColumns,
      handleFilter,
      formatCardTitle,
      formatCardDate,
      temperatureChart,
      precipitationChart,
    };
  },
});
</script>
