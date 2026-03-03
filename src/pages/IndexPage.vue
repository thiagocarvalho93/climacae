<template>
  <!-- Filtros -->
  <SecaoFiltros
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
      <InformacaoCard
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
      <InformacaoCard
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
      <InformacaoCard
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
      <InformacaoCard
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
      <GraficoTemperaturaGeral :loading="loading" ref="temperatureChart" />
    </div>

    <div class="col-12 col-sm-5 flex">
      <GraficoPrecipitacaoGeral
        :loading="loading"
        :periodo-selecionado="selectedPeriod"
        ref="precipitationChart"
      />
    </div>

    <div class="col-12 col-sm-7 flex">
      <MapaEstacoes />
    </div>

    <!-- Tabela -->
    <div class="col-12">
      <TabelaObservacoes
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
import { STATIONS, COLUNAS_TABELA } from "../constants/constants";
import dataUtils from "src/utils/data-utils";
import { useQuasar } from "quasar";
import RealTimeObservationsCarousel from "src/components/RealTimeObservationsCarousel.vue";
import InformacaoCard from "src/components/InformacaoCard.vue";
import TabelaObservacoes from "src/components/TabelaObservacoes.vue";
import SecaoFiltros from "src/components/SecaoFiltros.vue";
import GraficoTemperaturaGeral from "src/components/GraficoTemperaturaGeral.vue";
import GraficoPrecipitacaoGeral from "src/components/GraficoPrecipitacaoGeral.vue";
import MapaEstacoes from "src/components/MapaEstacoes.vue";
import { useNotification } from "src/composables/useNotification";
import { useDateRangeSetter } from "src/composables/useDateRangeSetter";
import { IObservation } from "src/models/observation-model";

export default defineComponent({
  name: "IndexPage",
  components: {
    RealTimeObservationsCarousel,
    InformacaoCard,
    TabelaObservacoes,
    SecaoFiltros,
    GraficoTemperaturaGeral,
    GraficoPrecipitacaoGeral,
    MapaEstacoes,
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
    const tableColumns = computed(() => COLUNAS_TABELA);

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
      return `Em ${estacao?.NOME} (${idEstacao})`;
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
