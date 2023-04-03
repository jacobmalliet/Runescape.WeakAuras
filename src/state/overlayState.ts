import { Component, reactive, watch } from 'vue';

// TODO: Replace with Pinia to manage local storage saving easier

const createReactiveLocalStorageBasedState = <T extends object>(
	key: string,
	defaultValue: T
) => {
	const state = reactive<T>(defaultValue);
	const existingLocalStorageJson = localStorage.getItem(key);
	if (existingLocalStorageJson) {
		Object.assign(state, JSON.parse(existingLocalStorageJson));
	}

	watch(state, (newVal) => {
		localStorage.setItem(key, JSON.stringify(newVal));
	});

	return state;
};

/*
 Overlay position state
 */
export const overlayPosition = createReactiveLocalStorageBasedState(
	'overlayPosition',
	{ x: 100, y: 100 }
);

/*
 Overlay plugin state
 */
type Plugin<T extends Component<TProps>, TProps> = {
	enabled: boolean;
	name: string;
	props: TProps;
};

export const overlayPlugins = createReactiveLocalStorageBasedState(
	'overlayPlugin',
	{
		allPlugins: [] as Plugin<Component, any>[],
	}
);

export const addPlugin = <TProps>(plugin: Component<TProps>, props: TProps) => {
	const pluginName = (plugin as any).__name;

	// Skip plugins that are already added
	if (overlayPlugins.allPlugins.find((p) => p.name === pluginName)) {
		return;
	}

	overlayPlugins.allPlugins.push({
		enabled: true,
		name: (plugin as any).__name || 'unknown',
		props: props,
	});
};
