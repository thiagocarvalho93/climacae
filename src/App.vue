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

@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes grow {
  from {
    transform: scale(0.1);
  }
  to {
    transform: scale(1);
  }
}

.fade {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-direction: alternate;
}

.grow {
  animation-name: grow;
  animation-duration: 0.1s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-direction: alternate;
}
</style>
