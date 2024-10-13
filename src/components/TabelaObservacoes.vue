<template>
  <q-table
    :class="
      $q.dark.isActive
        ? 'my-sticky-header-table-dark'
        : 'my-sticky-header-table'
    "
    flat
    column-sort-order="ad"
    title="Dados das estações"
    :rows="rows"
    :columns="columns"
    :pagination="pagination"
    :filter="filter"
    :rows-per-page-options="[6, 12, 24, 48, 96]"
    row-key="name"
    :loading="carregando"
  >
    <template v-slot:top-right>
      <q-input
        outlined
        dense
        debounce="700"
        v-model="filter"
        placeholder="Pesquisar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell="props">
      <q-td :props="props" :class="striped(props)">
        <span>{{ props.value }}</span>
      </q-td>
    </template>
  </q-table>
</template>
<script>
export default {
  props: {
    carregando: Boolean,
    rows: Array,
    columns: Array,
    periodoSelecionado: String,
    dataInicial: Date,
    dataFinal: Date,
  },
  data() {
    return {
      filter: "",
      mostrarInformacoesCard: true,
      pagination: {
        rowsPerPage: 12,
      },
    };
  },
  methods: {
    striped(props) {
      if (props.rowIndex % 2 != 0) {
        return this.$q.dark.isActive ? "dark-stripe" : "light-stripe";
      }
    },
  },
};
</script>

<style scoped lang="sass">
.dark-stripe
  background-image: linear-gradient(to right,#333, #333)
.light-stripe
  background-image: linear-gradient(to right,#eef, #eef)
.my-sticky-header-table
  /* height or max-height is important */
  height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #FFF

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.my-sticky-header-table-dark
  @extend .my-sticky-header-table

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $dark
</style>
