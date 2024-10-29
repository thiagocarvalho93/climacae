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
<style lang="sass">
\:root
  --scrollbar-width-height        : 10px
  --scrollbar-track               : #FFF
  --scrollbar-thumb               : rgb(204,231,255)
  --scrollbar-thumb-hover         : rgb(33,118,210)
  --scrollbar-track-dark          : $dark
  --scrollbar-thumb-dark          : #EEE
  --scrollbar-thumb-hover-dark    : rgb(33,118,210)

::-webkit-scrollbar
  width: var(--scrollbar-width-height)
  height: var(--scrollbar-width-height)

// the track (progress bar) of the scrollbar
::-webkit-scrollbar-track
  // border-top: var(--markdown-border)
  background: var(--scrollbar-track-dark)
  box-shadow: inset 0 0 4px var(--scrollbar-track-dark)

// the bottom corner of the scrollbar, where both horizontal and vertical scrollbars meet
::-webkit-scrollbar-corner
  background: var(--scrollbar-track-dark)

// the draggable scrolling handle
::-webkit-scrollbar-thumb
  background: var(--scrollbar-thumb-dark)
  border-radius: 5px

  &:hover
    background: var(--scrollbar-thumb-hover-dark)
</style>
