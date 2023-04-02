<script setup lang="ts">
import { MessageItem, onMessage, removeOnMessage } from '../helpers/chatbox';
import { onDeactivated, ref } from 'vue';
import IconContainer from './IconContainer.vue';
import { TimeSpan } from '../helpers/timespan';
import baseOverloadImageUrl from '../assets/Overload_salve.webp?url';

const processMessages = async (messages: MessageItem[]) => {
	const anyMessages = messages.some((message) =>
		message.text.includes('eating this')
	);

	if (!anyMessages) {
		return;
	}

	// Do something when detected
};

onMessage(processMessages);

onDeactivated(() => {
	removeOnMessage(processMessages);
});

const overloadDuration = TimeSpan.fromMinutes(60).totalMilliseconds;
</script>

<template>
	<div>
		<IconContainer :imageSrc="baseOverloadImageUrl" />
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
