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

      <q-btn push color="primary" class="q-ml-md q-pa-sm">
        <q-icon class="icon" size="sm" name="download" />
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="donwloadCsv">.csv</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>

    <template #body-cell="props">
      <q-td :props="props" :class="striped(props)">
        <span>{{ props.value }}</span>
      </q-td>
    </template>
  </q-table>
</template>
<script>
import { PERIODOS } from "src/constants/constants";
import Metric from "src/models/metric-model";

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

    formatarData(data) {
      const dia = new Date(data).getDate();
      const mes = new Date(data).getMonth();
      const ano = new Date(data).getFullYear();

      return `${dia}_${mes}_${ano}`;
    },

    nomePadraoCSV() {
      if (this.periodoSelecionado === PERIODOS.HOJE) {
        return `${this.formatarData(this.dataInicial)}.csv`;
      }
      return `${this.formatarData(this.dataInicial)}-${this.formatarData(
        this.dataFinal
      )}.csv`;
    },

    montarCsv() {
      let props = [
        "obsTimeLocal",
        "stationID",
        "humidityAvg",
        "humidityHigh",
        "humidityLow",
        "winddirAvg",
      ];

      let csvString = "";
      csvString += props.join(",");
      csvString += ",";
      csvString += Object.keys(new Metric()).join(",");
      csvString += "\n";

      for (const obs of this.rows) {
        csvString += props.map((prop) => obs[prop]).join(",");
        csvString += ",";
        csvString += Object.values(obs.metric).join(",");
        csvString += "\n";
      }

      return csvString;
    },

    async donwloadCsv() {
      const opts = {
        types: [
          {
            description: "CSV",
            accept: { "text/csv": [".csv"] },
          },
        ],
        suggestedName: this.nomePadraoCSV(),
      };

      try {
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();

        let csv = this.montarCsv();

        await writable.write(csv);
        await writable.close();

        const mensagem = `Arquivo ${handle.name} salvo com sucesso!`;
        this.mensagemSucesso(mensagem);
      } catch (err) {
        if (err.message === "The user aborted a request.") return; // cancelar
        const mensagem = `${err.message}`;
        this.mensagemErro(mensagem);
      }
    },

    mensagemErro(mensagem) {
      this.$q.notify({
        message: mensagem,
        type: "negative",
        progress: true,
        position: "top",
        actions: [
          {
            label: "Fechar",
            color: "white",
            handler: () => {},
          },
        ],
      });
    },

    mensagemSucesso(mensagem) {
      this.$q.notify({
        message: mensagem,
        type: "positive",
        progress: true,
        position: "top",
        actions: [
          {
            label: "Fechar",
            color: "white",
            handler: () => {},
          },
        ],
      });
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
