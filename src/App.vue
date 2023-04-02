<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import RunescapeOverlay from './components/RunescapeOverlay.vue';
</script>

<template>
	<HelloWorld />
	<!-- Hidden overlay element that is converted into an image and overlaid on runescape -->
	<div style="overflow: hidden; height: 0">
		<RunescapeOverlay />
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
