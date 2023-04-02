<script setup lang="ts">
import * as a1lib from '@alt1/base';
import domtoimage from 'dom-to-image';
import { MessageItem, onMessage, removeOnMessage } from '../helpers/chatbox';
import { ref, onDeactivated } from 'vue';

const overlayImage = async () => {
	const imageSrcString = await domtoimage.toPng(card.value!);

	const image = await a1lib.ImageDetect.imageDataFromUrl(imageSrcString);
	const result = a1lib.encodeImageString(
		image,
		0,
		0,
		image.width,
		image.height
	);
	alt1.overLayImage(100, 100, result, image.width, 5000);
};

const processMessages = async (messages: MessageItem[]) => {
	const anyMessages = messages.some((message) =>
		message.text.includes('eating this')
	);
	if (!anyMessages) {
		return;
	}

	await overlayImage();
};

const card = ref(null as HTMLElement | null);

onMessage(processMessages);

onDeactivated(() => {
	removeOnMessage(processMessages);
});
</script>

<template>
	<div class="card">
		<button ref="card" @click="overlayImage" style="color: red">
			Testing
		</button>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
