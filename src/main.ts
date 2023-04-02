import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as a1lib from '@alt1/base';

createApp(App).mount('#app');

if (window.alt1) {
	alt1.identifyAppUrl('./appconfig.json');
}
