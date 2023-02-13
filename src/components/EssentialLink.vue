<template>
  <q-item class="fade" clickable tag="a" @click="$router.push(path)">
    <q-item-section v-if="icon" avatar>
      <q-icon color="white" :name="icon" />
    </q-item-section>
    <q-tooltip anchor="center right" self="center left" :offset="[5, 20]">
      {{ title }}
    </q-tooltip>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    path: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },
  },

  methods: {
    selecionar() {
      this.$router.push(path);
    },
  },
});
</script>
