<script setup lang="ts">
import {
	clearMessages,
	allChatMessages,
	addChatMessage,
} from '../helpers/chatbox';
import * as a1lib from '@alt1/base';
import { executeEachTick } from '../helpers/tick';
import { overlayPosition, overlayPlugins } from '../state/overlayState';
import { ref } from 'vue';

const positionOverlay = () => {
	let lastUpdate = 0;
	alt1.setTooltip('Click to save overlay position.');
	const cancellationCheck = executeEachTick(() => {
		if (
			lastUpdate > 0 &&
			lastUpdate > alt1.rsLastActive &&
			typeof cancellationCheck !== 'undefined'
		) {
			cancellationCheck.cancel();
			alt1.clearTooltip();
			return;
		}

		lastUpdate = alt1.rsLastActive;

		const mousePosition = a1lib.getMousePosition();

		if (mousePosition === null) {
			return;
		}

		overlayPosition.x = mousePosition.x;
		overlayPosition.y = mousePosition.y;
	}, 25);
};

const newMessageText = ref('');

const addMessage = () => {
	if (newMessageText.value === '') {
		return;
	}

	addChatMessage({
		text: newMessageText.value,
		timestamp: new Date().toLocaleTimeString(),
	});
	newMessageText.value = '';
};
</script>

<template>
	<div class="card">
		<button type="button" @click="clearMessages">Clear Messages</button>
		<button type="button" @click="positionOverlay">
			Position Elements
		</button>

		<div>
			Plugins:
			<div v-for="plugin in overlayPlugins.allPlugins" :key="plugin.name">
				<input
					:id="'PluginEnabled_' + plugin.name"
					type="checkbox"
					v-model="plugin.enabled"
				/>
				<label :for="'PluginEnabled_' + plugin.name">
					{{ plugin.name }}
				</label>
			</div>

			<br />

			<input
				type="text"
				v-model="newMessageText"
				@keyup.enter="addMessage"
			/>

			<br />
			Messages:
			<div
				style="text-align: left"
				v-for="(message, index) in allChatMessages"
				:key="index"
			>
				[{{ message.timestamp }}] -
				{{ message.clanTag ? `[${message.clanTag}]` : '' }}
				{{ message.text }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
