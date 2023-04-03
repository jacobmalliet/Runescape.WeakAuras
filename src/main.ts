import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import components from './components/Trackers';
import { addPlugin } from './state/overlayState';

const app = createApp(App);

for (const component of components) {
	addPlugin(component, {});
}

// Register all plugins
for (const component of components) {
	addPlugin(component, {});
	app.component((component as any).__name, component);
}

// Mount
app.mount('#app');

if (window.alt1) {
	alt1.identifyAppUrl('./appconfig.json');
}
