// Tick rate in milliseconds
const tickRate = 600;

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Executes a given function every tickRate milliseconds
export const executeEachTick = (
	fn: () => void,
	functionTickRate = tickRate
) => {
	let running = true;
	const cancel = () => (running = false);

	const loop = async () => {
		while (running) {
			try {
				fn();
			} catch (error) {
				console.error('Error in tick loop: ', error);
			}
			await delay(functionTickRate);
		}
	};

	loop();
	return { cancel: cancel };
};
