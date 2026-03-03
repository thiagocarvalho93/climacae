<template>
  <div class="info-card-container" @click="showCardInfo = !showCardInfo">
    <div class="info-card-inner" :class="{ 'is-flipped': !showCardInfo }">
      <!-- FRONT SIDE -->
      <q-card class="info-card-side info-card-front" flat bordered>
        <q-card-section class="flex no-wrap items-center full-height">
          <div class="column justify-center grow overflow-hidden">
            <div class="text-overline text-grey-7 line-height-1 ellipsis">
              {{ title }}
            </div>
            <div class="text-h5 text-weight-bold text-primary q-mt-xs ellipsis">
              {{ description }}
            </div>
          </div>
          <q-avatar
            size="52px"
            class="q-ml-sm icon-avatar"
            :text-color="iconColor"
          >
            <q-icon :name="icon" size="28px" />
          </q-avatar>
        </q-card-section>

        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>

      <!-- BACK SIDE -->
      <q-card class="info-card-side info-card-back" flat bordered>
        <q-card-section class="flex column justify-center full-height">
          <div class="text-overline text-grey-7 line-height-1 ellipsis">
            {{ backTitle }}
          </div>
          <div
            class="text-subtitle1 text-weight-medium q-mt-xs ellipsis-2-lines"
          >
            {{ backDescription }}
          </div>
          <div class="text-caption text-grey-5 q-mt-sm italic">
            Clique para ver o valor
          </div>
        </q-card-section>

        <q-inner-loading :showing="loading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InfoCard",
  props: {
    loading: { type: Boolean, default: false },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    backTitle: { type: String, default: "" },
    backDescription: { type: String, default: "" },
    iconColor: { type: String, required: false, default: "primary" },
  },
  data() {
    return {
      showCardInfo: true,
    };
  },
});
</script>

<style lang="scss" scoped>
.info-card-container {
  perspective: 1000px;
  height: 110px;
  cursor: pointer;
  width: 100%;
}

.info-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;

  &.is-flipped {
    transform: rotateY(180deg);
  }
}

.info-card-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: var(--q-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.info-card-back {
  transform: rotateY(180deg);
}

.body--light .info-card-back {
  background-color: #fafafa;
}

.body--dark .info-card-back {
  background-color: #262626;
}

.icon-avatar {
  background-color: rgba(0, 0, 0, 0.05);
}

.body--dark .icon-avatar {
  background-color: rgba(255, 255, 255, 0.1);
}

.line-height-1 {
  line-height: 1.2;
}

.grow {
  flex-grow: 1;
}

.italic {
  font-style: italic;
}

.full-height {
  height: 100%;
}
</style>
