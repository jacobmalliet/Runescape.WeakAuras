<script setup lang="ts">
import { computed, onDeactivated, onMounted, reactive, ref, watch } from 'vue';
import domToImage from 'dom-to-image';

import * as a1lib from '@alt1/base';
import { overlayPlugins, overlayPosition } from '../state/overlayState';
import { TimeSpan } from '../helpers/timespan';

// Overlay
const groupName = 'RunescapeOverlay';
let overlay = ref(null as HTMLElement | null);

type DomImage = {
	width: number;
	height: number;
	imageBase64: string;
};

const domToImageData = async (): Promise<DomImage | undefined> => {
	if (overlay.value === null) {
		return;
	}

	const imageSrcString = await domToImage.toPng(overlay.value);

	const image = await a1lib.ImageDetect.imageDataFromUrl(imageSrcString);
	const result = a1lib.encodeImageString(
		image,
		0,
		0,
		image.width,
		image.height
	);

	return {
		width: image.width,
		height: image.height,
		imageBase64: result,
	};
};

let nextExecution = setTimeout(() => {}, 0);

let overlayImageData = reactive<DomImage>({
	width: 0,
	height: 0,
	imageBase64: '',
});

const refreshImageData = async () => {
	const newImageData = await domToImageData();

	if (newImageData === undefined) {
		overlayImageData.width = 0;
		overlayImageData.height = 0;
		overlayImageData.imageBase64 = '';
		return;
	} else {
		overlayImageData.width = newImageData.width;
		overlayImageData.height = newImageData.height;
		overlayImageData.imageBase64 = newImageData.imageBase64;
	}
};

const overlayImage = async () => {
	if (!window.alt1 || !alt1.permissionOverlay) {
		return;
	}

	if (overlayImageData.imageBase64.length === 0) {
		return;
	}

	// Force refresh every 20 seconds
	const nextExecutionTime = TimeSpan.fromSeconds(20).totalMilliseconds;

	// Longer time to remove overlay is used to prevent flickering
	const removeOverLayTime = TimeSpan.fromSeconds(25).totalMilliseconds;
	clearTimeout(nextExecution);

	// Refresh Overlay
	alt1.overLaySetGroup(groupName);
	alt1.overLayFreezeGroup(groupName);
	alt1.overLayClearGroup(groupName);

	// Set overlay content
	alt1.overLayImage(
		overlayPosition.x,
		overlayPosition.y,
		overlayImageData.imageBase64,
		overlayImageData.width,
		removeOverLayTime
	);

	// Force render
	alt1.overLayRefreshGroup(groupName);
	alt1.overLaySetGroup('');
	nextExecution = setTimeout(() => overlayImage(), nextExecutionTime);
};

// Observer tracks changes to the overlay content and re-renders the overlay
const observer = new MutationObserver(async () => {
	await refreshImageData();
});

onMounted(async () => {
	await refreshImageData();

	observer.observe(overlay.value as HTMLElement, {
		attributes: true,
		childList: true,
		subtree: true,
	});
});

onDeactivated(() => {
	observer.disconnect();
	clearTimeout(nextExecution);
	alt1.overLayClearGroup(groupName);
});

// When either the position or content of the overlay change, refresh the runescape display
watch(overlayPosition, () => overlayImage());
watch(overlayImageData, () => overlayImage());

const enabledPlugins = computed(() => {
	return overlayPlugins.allPlugins.filter((plugin) => plugin.enabled);
});
</script>

<template>
	<div ref="overlay" class="runescape-overlay">
		<span>Plugins</span>
		<Component
			v-for="plugin in enabledPlugins"
			:is="plugin.name"
			:key="plugin.name"
		/>
	</div>
</template>

<style scoped>
.runescape-overlay {
	display: flex;
	height: 60px;
	width: 60px;
}

.runescape-overlay * {
	margin-right: 5px;
}
</style>
