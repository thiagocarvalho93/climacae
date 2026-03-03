<template>
  <q-card
    flat
    bordered
    outline
    @click="showCardInfo = !showCardInfo"
    class="cursor-pointer"
  >
    <q-card-section class="grow" v-if="showCardInfo">
      <q-item>
        <q-item-section>
          <q-item-label class="text-caption"> {{ title }} </q-item-label>
          <q-item-label class="text-bold text-h6">
            {{ description }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon class="icon" :color="iconColor" size="lg" :name="icon" />
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="grow" v-else>
      <q-item>
        <q-item-section>
          <q-item-label class="text-caption">
            {{ backTitle }}
          </q-item-label>
          <q-item-label class="text-bold text-h6">
            {{ backDescription }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-inner-loading
      :showing="loading"
      label="Aguarde..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InfoCard",
  props: {
    loading: Boolean,
    title: String,
    description: String,
    icon: String,
    backTitle: String,
    backDescription: String,
    iconColor: { type: String, required: false, default: "primary" },
  },
  data() {
    return {
      showCardInfo: true,
    };
  },
});
</script>
