<template>
  <q-item clickable tag="a" @click="$router.push(path)">
    <q-item-section v-if="icon" avatar>
      <q-icon color="white" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-white">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator />
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
});
</script>
