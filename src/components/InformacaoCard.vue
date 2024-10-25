<template>
  <q-card
    flat
    bordered
    dark
    @click="mostrarInformacoesCard = !mostrarInformacoesCard"
    class="cursor-pointer"
    :class="classeCard"
  >
    <q-card-section class="grow" v-if="mostrarInformacoesCard">
      <q-item>
        <q-item-section>
          <q-item-label> {{ titulo }} </q-item-label>
          <q-item-label class="text-bold text-h6">
            {{ descricao }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon class="icon" size="lg" :name="icone" />
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="grow" v-else>
      <q-item>
        <q-item-section>
          <q-item-label>
            {{ tituloVerso }}
          </q-item-label>
          <q-item-label class="text-bold text-h6">
            {{ descricaoVerso }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-inner-loading
      :showing="carregando"
      label="Aguarde..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<script>
export default {
  props: {
    carregando: Boolean,
    titulo: String,
    descricao: String,
    icone: String,
    tituloVerso: String,
    descricaoVerso: String,
    classeCard: String,
  },
  data() {
    return {
      mostrarInformacoesCard: true,
    };
  },
};
</script>
