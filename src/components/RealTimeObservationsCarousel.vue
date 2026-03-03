<template>
  <q-card flat bordered class="full-width realtime-card">
    <q-card-section class="q-pb-none">
      <div class="row items-center no-wrap">
        <div class="live-indicator q-mr-sm"></div>
        <div class="text-subtitle2 text-weight-bold text-uppercase text-grey-7">
          Agora
        </div>
        <q-space />
        <div class="text-caption text-grey-6">
          Atualizado em: {{ lastUpdate }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-carousel
        v-model="slide"
        transition-duration="600"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        :control-color="darkMode ? 'white' : 'primary'"
        padding
        arrows
        infinite
        height="280px"
        v-model:autoplay="autoplay"
        class="bg-transparent custom-carousel"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide
          v-for="data in realTimeObservations"
          :key="data.stationID"
          :name="stations[data.stationID]?.NAME || ''"
          class="column no-wrap"
        >
          <div class="text-center q-mb-md">
            <div class="text-h6 text-weight-bolder text-primary truncate-text">
              {{ stations[data.stationID]?.NAME }}
            </div>
            <div class="text-caption text-grey-7">{{ data.stationID }}</div>
          </div>

          <div class="row items-center justify-center q-mb-lg">
            <div class="main-temp-container">
              <span class="main-temp-value">{{ data.metric.temp }}</span>
              <span class="main-temp-unit">°C</span>
            </div>
          </div>

          <div class="row q-col-gutter-sm text-center">
            <div class="col-4">
              <div class="metric-item">
                <q-icon name="water_drop" color="blue-5" size="xs" />
                <div class="text-caption text-grey-7">Umidade</div>
                <div class="text-weight-bold">{{ data.humidity }}%</div>
              </div>
            </div>
            <div class="col-4">
              <div class="metric-item">
                <q-icon name="air" color="teal-5" size="xs" />
                <div class="text-caption text-grey-7">Vento</div>
                <div class="text-weight-bold">
                  {{ data.metric.windSpeed }} <small>km/h</small>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="metric-item">
                <q-icon name="ion-rainy" color="indigo-5" size="xs" />
                <div class="text-caption text-grey-7">Chuva</div>
                <div class="text-weight-bold">
                  {{ data.metric.precipRate }} <small>mm/h</small>
                </div>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>

    <q-inner-loading
      :showing="loading"
      label="Atualizando dados..."
      label-class="text-primary"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  PropType,
} from "vue";
import { STATIONS, Stations } from "src/constants/constants";
import { useObservationStore } from "src/stores/observations";

export default defineComponent({
  name: "RealTimeObservationsCarousel",
  props: {
    stations: {
      type: Object as PropType<Stations>,
      required: true,
    },
    darkMode: Boolean,
  },

  setup() {
    const store = useObservationStore();
    const slide = ref(STATIONS[Object.keys(STATIONS)[0]].NAME);
    const loading = ref(false);
    const autoplay = ref<boolean | number>(true);
    const lastUpdate = ref(
      new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const realTimeObservations = computed(() => store.realTimeObservations);
    const stationIds = computed(() => Object.keys(STATIONS));

    let intervalId: any = null;

    const fetchRealTime = async () => {
      loading.value = true;
      try {
        await store.getRealTimeObservations(stationIds.value);
        lastUpdate.value = new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await fetchRealTime();
      intervalId = setInterval(fetchRealTime, 30000);
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      slide,
      loading,
      autoplay,
      lastUpdate,
      realTimeObservations,
      fetchRealTime,
    };
  },
});
</script>

<style scoped lang="scss">
.realtime-card {
  min-height: 340px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 249, 250, 1) 100%
  );
  border-radius: 12px;
  transition: all 0.3s ease;

  .body--dark & {
    background: linear-gradient(145deg, #1d1d1d 0%, #121212 100%);
  }
}

.live-indicator {
  width: 10px;
  height: 10px;
  background-color: #f44336;
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(244, 67, 54, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

.main-temp-container {
  display: flex;
  align-items: baseline;
  color: var(--q-primary);

  .body--dark & {
    color: #fff;
  }
}

.main-temp-value {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
}

.main-temp-unit {
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: 4px;
}

.metric-item {
  padding: 8px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .body--dark & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.q-carousel__navigation) {
  bottom: 0px;
}

// Fixed arrow styling
:deep(.q-carousel__prev-arrow),
:deep(.q-carousel__next-arrow) {
  background: transparent !important; // Remove the background
  padding: 0;
  margin: 0;

  .q-btn {
    background: transparent !important;
    box-shadow: none !important;

    // Optional: add a slight hover effect instead
    &:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      .body--dark & {
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }
  }
}
</style>
