<template>
  <q-card flat class="q-pa-md q-mb-md fade">
    <div class="row q-col-gutter-md">
      <div v-if="nomesEstacoes" class="col-12 col-sm-4 col-md-2 fade">
        <q-select
          dense
          v-model="estacaoSelecionadaProxy"
          :options="nomesEstacoes"
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
          v-model="periodoSelecionadoProxy"
          :options="opcoesPeriodos"
          label="Período"
        />
      </div>
      <div
        v-if="periodoSelecionadoProxy === periodos.DIA_ESPECIFICO"
        class="col-4 col-sm-2 col-md-1 fade"
      >
        <q-select
          dense
          outlined
          v-model="diaSelecionadoProxy"
          :options="opcoesDias"
          label="Dia"
        />
      </div>
      <div
        v-if="
          periodoSelecionadoProxy === periodos.MES_ESPECIFICO ||
          periodoSelecionadoProxy === periodos.DIA_ESPECIFICO
        "
        :class="
          (periodoSelecionadoProxy === periodos.DIA_ESPECIFICO
            ? 'col-4 '
            : 'col-6 ') + 'col-sm-2 col-md-1 fade'
        "
      >
        <q-select
          dense
          outlined
          v-model="mesSelecionadoProxy"
          :options="opcoesMeses"
          label="Mês"
        />
      </div>
      <div
        v-if="
          periodoSelecionadoProxy === periodos.MES_ESPECIFICO ||
          periodoSelecionadoProxy === periodos.DIA_ESPECIFICO
        "
        :class="
          (periodoSelecionadoProxy === periodos.DIA_ESPECIFICO
            ? 'col-4 '
            : 'col-6 ') + 'col-sm-2 col-md-1 fade'
        "
      >
        <q-select
          dense
          outlined
          v-model="anoSelecionadoProxy"
          :options="opcoesAnos"
          label="Ano"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-2 col-lg-1 fade">
        <q-btn
          push
          @click="obterDadosEstacao"
          style="width: 100%"
          :loading="carregando"
          color="primary"
        >
          Filtrar
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Carregando
          </template>
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    carregando: Boolean,
    estacaoSelecionada: Object,
    periodoSelecionado: String,
    diaSelecionado: Number,
    mesSelecionado: Number,
    anoSelecionado: Number,
    nomesEstacoes: Array,
    opcoesPeriodos: Array,
    opcoesDias: Array,
    opcoesMeses: Array,
    opcoesAnos: Array,
    periodos: Object,
  },
  setup(props, context) {
    const estacaoSelecionadaProxy = computed({
      get: () => props.estacaoSelecionada,
      set: (value) => {
        context.emit("update:estacaoSelecionada", value);
      },
    });

    const periodoSelecionadoProxy = computed({
      get: () => props.periodoSelecionado,
      set: (value) => {
        context.emit("update:periodoSelecionado", value);
      },
    });

    const diaSelecionadoProxy = computed({
      get: () => props.diaSelecionado,
      set: (value) => {
        context.emit("update:diaSelecionado", value);
      },
    });

    const mesSelecionadoProxy = computed({
      get: () => props.mesSelecionado,
      set: (value) => {
        context.emit("update:mesSelecionado", value);
      },
    });

    const anoSelecionadoProxy = computed({
      get: () => props.anoSelecionado,
      set: (value) => {
        context.emit("update:anoSelecionado", value);
      },
    });

    const obterDadosEstacao = () => {
      context.emit("obterDados");
    };

    return {
      estacaoSelecionadaProxy,
      periodoSelecionadoProxy,
      diaSelecionadoProxy,
      mesSelecionadoProxy,
      anoSelecionadoProxy,
      obterDadosEstacao,
    };
  },
});
</script>

<style scoped></style>
