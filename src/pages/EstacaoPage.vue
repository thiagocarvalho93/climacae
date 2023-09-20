<template>
  <q-page :class="`q-pa-md ${darkMode ? 'bg-dark-page' : 'bg-blue-grey-1'}`">
    <q-card flat class="q-pa-md q-mb-md fade">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-4 col-md-2 fade">
          <q-select
            dense
            v-model="estacaoSelecionada"
            :options="Object.values(estacoes)"
            outlined
            hide-bottom-space
            input-style="{ background-color: red }"
            option-label="NOME"
            label="Estação"
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2 fade">
          <q-select
            dense
            outlined
            v-model="periodoSelecionado"
            :options="opcoesPeriodos"
            label="Período"
          />
        </div>
        <div
          v-if="periodoSelecionado === periodos.DIA_ESPECIFICO"
          class="col-4 col-sm-2 col-md-1 fade"
        >
          <q-select
            dense
            outlined
            v-model="diaSelecionado"
            :options="opcoesDias"
            label="Dia"
          />
        </div>
        <div
          v-if="
            periodoSelecionado === periodos.MES_ESPECIFICO ||
            periodoSelecionado === periodos.DIA_ESPECIFICO
          "
          :class="
            (periodoSelecionado === periodos.DIA_ESPECIFICO
              ? 'col-4 '
              : 'col-6 ') + 'col-sm-2 col-md-1 fade'
          "
        >
          <q-select
            dense
            outlined
            v-model="mesSelecionado"
            :options="opcoesMeses"
            label="Mês"
          />
        </div>
        <div
          v-if="
            periodoSelecionado === periodos.MES_ESPECIFICO ||
            periodoSelecionado === periodos.DIA_ESPECIFICO
          "
          :class="
            (periodoSelecionado === periodos.DIA_ESPECIFICO
              ? 'col-4 '
              : 'col-6 ') + 'col-sm-2 col-md-1 fade'
          "
        >
          <q-select
            dense
            outlined
            v-model="anoSelecionado"
            :options="opcoesAnos"
            label="Ano"
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
          <q-btn
            push
            @click="obterCalcularEAtualizar"
            style="width: 100%"
            :loading="carregando"
            color="primary"
            >Filtrar
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Carregando
            </template>
          </q-btn>
        </div>
      </div>
    </q-card>

    <q-card flat class="q-pa-md q-mb-md fade">
      <p>Em construção :)</p>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { STATIONS, PERIODOS } from "../constants/constants";
import arrayUtils from "src/utils/array-utils";
import dataUtils from "src/utils/data-utils";

export default defineComponent({
  name: "EstacaoPage",
  components: {},

  computed: {
    darkMode() {
      return this.$q.dark.isActive;
    },
  },

  data() {
    return {
      carregando: false,
      dataInicial: new Date(),
      dataFinal: new Date(),
      //opções
      estacoes: STATIONS,
      periodos: PERIODOS,
      opcoesPeriodos: Object.values(PERIODOS),
      opcoesDias: arrayUtils.arrayRange(1, dataUtils.calcularDiaMesAtual(), 1),
      opcoesMeses: Array.from({ length: 12 }, (_, i) => i + 1),
      opcoesAnos: arrayUtils.arrayRange(2020, new Date().getFullYear(), 1),
      //seleções
      estacaoSelecionada: Object.values(STATIONS)[0],
      periodoSelecionado: PERIODOS.HOJE,
      diaSelecionado: new Date().getDate(),
      mesSelecionado: new Date().getMonth() + 1,
      anoSelecionado: new Date().getFullYear(),
    };
  },

  methods: {
    obterCalcularEAtualizar() {
      this.carregando = false;
    },
  },
});
</script>
