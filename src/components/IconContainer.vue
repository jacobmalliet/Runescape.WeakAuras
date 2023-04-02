<script setup lang="ts">
import { ref } from 'vue';
import { imageToBase64Async } from '../helpers/imageHelper';

const props = defineProps({
	imageSrc: String,
});

const imageUrl = ref(props.imageSrc);

// Cache image as base64 - Prevents additional network requests when domToImage is called
imageToBase64Async(props.imageSrc!).then((dataUrl) => {
	imageUrl.value = dataUrl;
});
</script>

<template>
	<div class="icon-container">
		<img :src="imageUrl" class="logo" width="35" height="50" />
	</div>
</template>

<style scoped>
.icon-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
	width: 60px;
	border: 1px red solid;
	border-radius: 4px;
}
</style>
