<template>
  <q-table
    class="observations-table overflow-hidden fade"
    :class="
      $q.dark.isActive
        ? 'my-sticky-header-table-dark'
        : 'my-sticky-header-table'
    "
    flat
    bordered
    column-sort-order="ad"
    :rows="rows"
    :columns="columns"
    :pagination="pagination"
    :filter="filter"
    :rows-per-page-options="[12, 24, 48, 96]"
    row-key="id"
    :loading="loading"
  >
    <template v-slot:top>
      <div class="row no-wrap items-center full-width">
        <q-icon name="table_view" size="xs" class="q-mr-sm" color="primary" />
        <div class="text-subtitle2 text-uppercase text-weight-bold letter-spacing-1">
          Histórico de Observações
        </div>
        <q-space />
        <q-input
          outlined
          dense
          square
          debounce="700"
          v-model="filter"
          placeholder="Pesquisar..."
          class="search-input"
        >
          <template v-slot:append>
            <q-icon name="search" size="xs" />
          </template>
        </q-input>
      </div>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props" class="bg-grey-1 dark-header">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-weight-bold text-uppercase text-grey-8 font-size-11"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template #body-cell="props">
      <q-td :props="props" :class="striped(props)">
        <span class="text-weight-medium">{{ props.value }}</span>
      </q-td>
    </template>

    <template v-slot:loading>
      <q-inner-loading showing color="primary">
        <q-spinner-dots size="40px" />
      </q-inner-loading>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { QTableColumn } from "quasar";

export default defineComponent({
  name: "ObservationsTable",
  props: {
    loading: Boolean,
    rows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<QTableColumn[]>,
      default: () => [],
    },
    selectedPeriod: String,
    startDate: Date as PropType<Date | null>,
    endDate: Date as PropType<Date | null>,
  },
  setup() {
    const filter = ref("");
    const pagination = ref({
      rowsPerPage: 12,
    });

    return {
      filter,
      pagination,
    };
  },
  methods: {
    striped(props: any) {
      if (props.rowIndex % 2 != 0) {
        return this.$q.dark.isActive ? "dark-stripe" : "light-stripe";
      }
      return "";
    },
  },
});
</script>

<style scoped lang="scss">
.font-size-11 {
  font-size: 11px;
}

.search-input {
  width: 250px;
  @media (max-width: 599px) {
    width: 100%;
    margin-top: 10px;
  }
}

.dark-stripe {
  background-color: rgba(255, 255, 255, 0.03);
}
.light-stripe {
  background-color: rgba(0, 0, 0, 0.02);
}

.my-sticky-header-table {
  height: 500px;

  :deep(.q-table__top) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 12px 16px;
  }

  :deep(.q-table__bottom) {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  thead tr:first-child th {
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .body--dark & {
    :deep(.q-table__top), :deep(.q-table__bottom) {
      border-color: rgba(255, 255, 255, 0.1);
    }
    thead tr:first-child th {
      background-color: #262626;
    }
  }
}
</style>
