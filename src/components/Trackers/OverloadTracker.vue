<script lang="ts" setup>
import { MessageItem, onMessage, removeOnMessage } from '../../helpers/chatbox';
import { computed, onDeactivated, ref } from 'vue';
import IconContainer from './../IconContainer.vue';
import { TimeSpan } from '../../helpers/timespan';
import baseOverloadImageUrl from '../../assets/Overload_salve.webp?url';
import RemainingTime from '../RemainingTime.vue';

const props = defineProps({});

const processMessages = async (messages: MessageItem[]) => {
	const anyMessages = messages.some((message) =>
		message.text.includes('eating this')
	);

	if (!anyMessages) {
		return;
	}

	lastDrinkTime.value = Date.now();
};

onMessage(processMessages);

onDeactivated(() => {
	removeOnMessage(processMessages);
});

const overloadDuration = TimeSpan.fromMinutes(6).totalMilliseconds;
const lastDrinkTime = ref(0);

const overloadExpiration = computed(() => {
	if (lastDrinkTime.value === 0) {
		return -1;
	}

	return lastDrinkTime.value + overloadDuration;
});
</script>

<template>
	<div class="icon-with-timer">
		<IconContainer :imageSrc="baseOverloadImageUrl" />
		<RemainingTime
			v-if="overloadExpiration > 0"
			:expirationTime="overloadExpiration"
		/>
	</div>
</template>

<style scoped>
.icon-with-timer {
  display: block;
  box-sizing: border-box;
  position: relative;
  height: 60px;
  min-width: 60px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid red;
}
</style>
