<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-direction: alternate;
}
</style>
