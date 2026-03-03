<template>
  <q-card flat bordered class="q-mb-md filter-section-card fade">
    <q-card-section class="q-pa-none">
      <div class="row no-wrap items-center bg-grey-1 text-grey-8 q-px-md q-py-sm border-bottom dark-header">
        <q-icon name="filter_alt" size="xs" class="q-mr-sm" />
        <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
          Filtros de Pesquisa
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <div class="row q-col-gutter-md items-end">
        <!-- Station Selection (Conditional) -->
        <div v-if="stationNames" class="col-12 col-sm-4 col-md-3">
          <div class="filter-label">Estação</div>
          <q-select
            dense
            v-model="selectedStationProxy"
            :options="stationNames"
            outlined
            hide-bottom-space
            option-label="NAME"
            placeholder="Selecione a estação"
          >
            <template v-slot:prepend>
              <q-icon name="sensors" size="xs" />
            </template>
          </q-select>
        </div>

        <!-- Period Selection -->
        <div class="col-12 col-sm-4 col-md-2">
          <div class="filter-label">Período</div>
          <q-select
            dense
            outlined
            v-model="selectedPeriodProxy"
            :options="periodOptions"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" size="xs" />
            </template>
          </q-select>
        </div>

        <!-- Date Specific Controls -->
        <div v-if="selectedPeriodProxy === periods.SPECIFIC_DAY" class="col-4 col-sm-2 col-md-1">
          <div class="filter-label text-center">Dia</div>
          <q-select
            dense
            outlined
            v-model="selectedDayProxy"
            :options="dayOptions"
            hide-bottom-space
            class="centered-selection"
          />
        </div>

        <div
          v-if="selectedPeriodProxy === periods.SPECIFIC_MONTH || selectedPeriodProxy === periods.SPECIFIC_DAY"
          :class="(selectedPeriodProxy === periods.SPECIFIC_DAY ? 'col-4 ' : 'col-6 ') + 'col-sm-2 col-md-1'"
        >
          <div class="filter-label text-center">Mês</div>
          <q-select
            dense
            outlined
            v-model="selectedMonthProxy"
            :options="monthOptions"
            hide-bottom-space
            class="centered-selection"
          />
        </div>

        <div
          v-if="selectedPeriodProxy === periods.SPECIFIC_MONTH || selectedPeriodProxy === periods.SPECIFIC_DAY"
          :class="(selectedPeriodProxy === periods.SPECIFIC_DAY ? 'col-4 ' : 'col-6 ') + 'col-sm-2 col-md-1'"
        >
          <div class="filter-label text-center">Ano</div>
          <q-select
            dense
            outlined
            v-model="selectedYearProxy"
            :options="yearOptions"
            hide-bottom-space
            class="centered-selection"
          />
        </div>

        <q-space />

        <!-- Actions -->
        <div class="col-12 col-sm-auto row q-gutter-sm">
          <q-btn
            unelevated
            @click="fetchData"
            :loading="loading"
            color="primary"
            class="filter-btn"
            icon="search"
            label="Filtrar"
          >
            <template v-slot:loading>
              <q-spinner-dots />
            </template>
          </q-btn>
          
          <q-btn
            outline
            @click="exportCsv"
            :loading="loading"
            color="primary"
            class="filter-btn"
            icon="download"
            label="Exportar CSV"
          >
            <template v-slot:loading>
              <q-spinner-dots />
            </template>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  YEAR_OPTIONS,
  DAY_OPTIONS,
  MONTH_OPTIONS,
  PERIODS,
  StationInfo,
} from "src/constants/constants";
import csvUtils from "src/utils/csv-utils";
import { computed, defineComponent, PropType } from "vue";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "FilterSection",
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

    const periodOptions = computed(() => Object.values(PERIODS));
    const dayOptions = computed(() => DAY_OPTIONS);
    const monthOptions = computed(() => MONTH_OPTIONS);
    const yearOptions = computed(() => YEAR_OPTIONS);
    const periods = computed(() => PERIODS);
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

<style lang="scss" scoped>
.filter-section-card {
  overflow: hidden;
}

.filter-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #757575;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.filter-btn {
  height: 40px;
  min-width: 120px;
}

.centered-selection {
  :deep(.q-field__native) {
    justify-content: center;
    text-align: center;
  }
}

.body--dark {
  .dark-header {
    background-color: rgba(255, 255, 255, 0.05) !important;
    color: #e0e0e0 !important;
  }
  .border-bottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .filter-label {
    color: #bdbdbd;
  }
}
</style>
