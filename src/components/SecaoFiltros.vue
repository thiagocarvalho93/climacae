<template>
  <q-card flat bordered class="q-pa-md q-mb-md fade">
    <div class="row q-col-gutter-md">
      <div v-if="stationNames" class="col-12 col-sm-4 col-md-2 fade">
        <q-select
          dense
          v-model="selectedStationProxy"
          :options="stationNames"
          outlined
          hide-bottom-space
          option-label="NOME"
          label="Estação"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-2 fade">
        <q-select
          dense
          outlined
          v-model="selectedPeriodProxy"
          :options="periodOptions"
          label="Período"
        />
      </div>
      <div
        v-if="selectedPeriodProxy === periods.DIA_ESPECIFICO"
        class="col-4 col-sm-2 col-md-1 fade"
      >
        <q-select
          dense
          outlined
          v-model="selectedDayProxy"
          :options="dayOptions"
          label="Dia"
        />
      </div>
      <div
        v-if="
          selectedPeriodProxy === periods.MES_ESPECIFICO ||
          selectedPeriodProxy === periods.DIA_ESPECIFICO
        "
        :class="
          (selectedPeriodProxy === periods.DIA_ESPECIFICO
            ? 'col-4 '
            : 'col-6 ') + 'col-sm-2 col-md-1 fade'
        "
      >
        <q-select
          dense
          outlined
          v-model="selectedMonthProxy"
          :options="monthOptions"
          label="Mês"
        />
      </div>
      <div
        v-if="
          selectedPeriodProxy === periods.MES_ESPECIFICO ||
          selectedPeriodProxy === periods.DIA_ESPECIFICO
        "
        :class="
          (selectedPeriodProxy === periods.DIA_ESPECIFICO
            ? 'col-4 '
            : 'col-6 ') + 'col-sm-2 col-md-1 fade'
        "
      >
        <q-select
          dense
          outlined
          v-model="selectedYearProxy"
          :options="yearOptions"
          label="Ano"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
        <q-btn
          @click="fetchData"
          style="width: 100%"
          :loading="loading"
          color="primary"
        >
          Filtrar
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Carregando
          </template>
        </q-btn>
      </div>
      <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
        <q-btn
          @click="exportCsv"
          style="width: 100%"
          :loading="loading"
          color="primary"
        >
          Exportar Csv
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Carregando
          </template>
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import {
  OPCOES_ANOS,
  OPCOES_DIAS,
  OPCOES_MESES,
  PERIODOS,
  StationInfo,
} from "src/constants/constants";
import csvUtils from "src/utils/csv-utils";
import { computed, defineComponent, PropType } from "vue";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "SecaoFiltros",
  props: {
    loading: Boolean,
    selectedStation: Object as PropType<StationInfo>,
    selectedPeriod: String,
    selectedDay: Number,
    selectedMonth: Number,
    selectedYear: Number,
    stationNames: Array as PropType<StationInfo[]>,
  },
  emits: [
    "update:selectedStation",
    "update:selectedPeriod",
    "update:selectedDay",
    "update:selectedMonth",
    "update:selectedYear",
    "fetchData",
    "exportCsv",
  ],
  setup(props, context) {
    const store = useObservationStore();

    const selectedStationProxy = computed({
      get: () => props.selectedStation,
      set: (value) => {
        context.emit("update:selectedStation", value);
      },
    });

    const selectedPeriodProxy = computed({
      get: () => props.selectedPeriod,
      set: (value) => {
        context.emit("update:selectedPeriod", value);
      },
    });

    const selectedDayProxy = computed({
      get: () => props.selectedDay,
      set: (value) => {
        context.emit("update:selectedDay", value);
      },
    });

    const selectedMonthProxy = computed({
      get: () => props.selectedMonth,
      set: (value) => {
        context.emit("update:selectedMonth", value);
      },
    });

    const selectedYearProxy = computed({
      get: () => props.selectedYear,
      set: (value) => {
        context.emit("update:selectedYear", value);
      },
    });

    const periodOptions = computed(() => Object.values(PERIODOS));
    const dayOptions = computed(() => OPCOES_DIAS);
    const monthOptions = computed(() => OPCOES_MESES);
    const yearOptions = computed(() => OPCOES_ANOS);
    const periods = computed(() => PERIODOS);
    const observations = computed(() => store.getObservations);
    const startDate = computed(() => store.getStartDate);
    const endDate = computed(() => store.getEndDate);

    const fetchData = () => {
      context.emit("fetchData");
    };

    const exportCsv = () => {
      context.emit("exportCsv");

      const csvName = csvUtils.getCsvFileName(
        selectedPeriodProxy.value || "",
        startDate.value,
        endDate.value
      );
      const csv = csvUtils.getCsvString(observations.value);

      csvUtils.downloadCsv(csvName, csv);
    };

    return {
      selectedStationProxy,
      selectedPeriodProxy,
      selectedDayProxy,
      selectedMonthProxy,
      selectedYearProxy,
      fetchData,
      exportCsv,
      periodOptions,
      dayOptions,
      monthOptions,
      yearOptions,
      periods,
      observations,
    };
  },
});
</script>

<style scoped></style>
