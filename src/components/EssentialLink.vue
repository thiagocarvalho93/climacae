<template>
  <q-item-section v-if="icon" avatar>
    <q-icon class="icon" color="white" :name="icon" />
  </q-item-section>
  <q-tooltip anchor="center right" self="center left" :offset="[5, 20]">
    {{ title }}
  </q-tooltip>
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

<style scoped>
.item:hover {
  animation: fadeIn 1s infinite alternate;
}
</style>
