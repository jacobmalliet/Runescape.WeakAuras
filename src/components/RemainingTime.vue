<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import { executeEachTick } from '../helpers/tick';
import { TimeSpan } from '../helpers/timespan'

const props = defineProps({
	expirationTime: {
		type: Number,
		required: true,
	},
});

let remainingTime = ref(props.expirationTime - Date.now());
let totalCooldownTime = ref(props.expirationTime - Date.now());

let timeMonitor = { cancel: () => {} };

const startTimer = () => {
	// Cancel previous timer
  totalCooldownTime.value = props.expirationTime - Date.now();
	timeMonitor.cancel();

	timeMonitor = executeEachTick(() => {
		const msRemaining = props.expirationTime - Date.now();

		if (msRemaining > 0) {
			remainingTime.value = msRemaining;
			return;
		} else {
			remainingTime.value = 0;
			timeMonitor.cancel();
		}
	}, 1000);
};

const formattedTimeRemaining = computed(() => {
  const timeStamp = TimeSpan.fromMs(remainingTime.value);
  
  return timeStamp.toString();
});

const percentComplete = computed(() => {
  const percent = (remainingTime.value / totalCooldownTime.value) * 100;
  
  if (percent <= 0) {
    return undefined;
  }

  return `${percent}%`;
});

// Restart timer when expiration time changes
watch(
	() => props.expirationTime,
	() => {
		startTimer();
	},
	{ immediate: true }
);
</script>

<template>
  <div class="cooldown-gradiant" :style="{ '--time-left': percentComplete }">
    <div class="cooldown-text">{{ formattedTimeRemaining }}</div>
  </div>
</template>

<style scoped>
.cooldown-gradiant {
  font-size: 18px;
  vertical-align: bottom;
  content: '';
  position: absolute;
  background: conic-gradient(
      rgba(0, 0, 0, 0.7) var(--time-left),
      rgba(0, 0, 0, 0.1) var(--time-left));
  opacity: .8;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cooldown-text {
  color: white;
  font-size: 18px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  text-shadow: 0.05em 0 black, 0 0.05em black, -0.05em 0 black, 0 -0.05em black, -0.05em -0.05em black, -0.05em 0.05em black, 0.05em -0.05em black, 0.05em 0.05em black;
}
</style>
