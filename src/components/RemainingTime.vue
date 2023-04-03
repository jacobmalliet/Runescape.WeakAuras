<script setup lang="ts">
import { ref, watch } from 'vue';
import { executeEachTick } from '../helpers/tick';

const props = defineProps({
	expirationTime: {
		type: Number,
		required: true,
	},
});

let remainingTime = ref(Date.now() - props.expirationTime);

let timeMonitor = { cancel: () => {} };

const startTimer = () => {
	// Cancel previous timer
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
	{{ remainingTime }}
</template>

<style scoped></style>
