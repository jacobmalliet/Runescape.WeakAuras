<script setup lang="ts">
import { clearMessages, allChatMessages } from '../helpers/chatbox';
import OverloadTracker from './OverloadTracker.vue';
</script>

<template>
	<div class="card">
		<button type="button" @click="clearMessages">Clear Messages</button>
		<div>
			Plugins:

			<br />
			<OverloadTracker />

			Messages:
			<br />
			<div style="text-align: left;" v-for="(message, index) in allChatMessages" :key="index">
				[{{message.timestamp}}] - {{message.clanTag ? `[${message.clanTag}]` : ""}} {{ message.text }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
