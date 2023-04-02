import { reactive, watch } from 'vue';

export let overlayPosition = reactive({ x: 100, y: 100 });

// TODO: Replace with Pinia to manage local storage saving easier
// Restore from local storage if exists
const existingLocalStorageJson = localStorage.getItem('overlayPosition');
if (existingLocalStorageJson) {
	Object.assign(overlayPosition, JSON.parse(existingLocalStorageJson));
}

// Save to local storage on change
watch(overlayPosition, (newVal) => {
	localStorage.setItem('overlayPosition', JSON.stringify(newVal));
});
