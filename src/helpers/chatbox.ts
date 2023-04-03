import * as a1lib from '@alt1/base';
import ChatBoxReader, { ChatLine } from '@alt1/chatbox';
import { ref } from 'vue';
import { executeEachTick } from './tick';

const reader = new ChatBoxReader();
let hasLeftFound = false;

const highlightChatArea = function () {
	if (!reader.pos) {
		return;
	}

	const p = reader.pos;
	alt1.overLayRect(
		a1lib.mixColor(255, 255, 255),
		p.mainbox.rect.x,
		p.mainbox.rect.y,
		p.mainbox.rect.width,
		p.mainbox.rect.height,
		2000,
		1
	);
};

const tryFind = function () {
	if (reader.pos) {
		return;
	}

	reader.find();
	highlightChatArea();
};

const read = function () {
	const lastResult = reader.read();

	if (hasLeftFound != reader.pos?.mainbox.leftfound) {
		hasLeftFound = true;
		highlightChatArea();
	}

	return lastResult;
};

export type MessageItem = {
	timestamp?: string;
	clanTag?: string;
	text: string;
};

// Given a message with the format [24:16:00] Message text parse that into individual timestamp and message parts
// The message can also optionally contain a clan tag in the format [24:16:00] [Clan Tag] Message text
const parseChatBoxLine = (line: ChatLine): MessageItem => {
	const group = line.text.match(/\[(.*?)]/g);

	if (group && group.length > 0) {
		const timestamp = group[0].replace('[', '').replace(']', '');
		const clanTag =
			group.length > 1
				? group[1].replace('[', '').replace(']', '')
				: undefined;
		const message = line.text
			.replace(group[0], '')
			.replace(group[1], '')
			.trim();

		return { timestamp, clanTag, text: message };
	}

	return { text: line.text };
};

const messageContainsContent = (messageItem: MessageItem) =>
	messageItem.text.replace(' ', '').length > 0;

export const allChatMessages = ref([] as MessageItem[]);

const tryGetChatBoxMessages = () => {
	try {
		if (!reader.pos) {
			tryFind();
			return [];
		} else {
			const result = read() || [];
			return result
				.map(parseChatBoxLine)
				.filter(messageContainsContent)
				.reduce<MessageItem[]>((prev, current) => {
					if (typeof prev === 'undefined') {
						return [current];
					}

					if (current.timestamp) {
						return [...prev, current];
					}

					if (prev.length === 0) {
						return [];
					}

					const previous = prev[prev.length - 1];
					previous.text = `${previous.text} ${current.text}`;
					return prev;
				}, []);
		}
	} catch (error) {
		console.error(error);
		return [];
	}
};

let tickHandler = {
	cancel: () => {
		return;
	},
};

// Event Handlers
const eventHandlers = [] as ((messages: MessageItem[]) => void)[];

export const onMessage = (callback: (messages: MessageItem[]) => void) => {
	eventHandlers.push(callback);
};

export const removeOnMessage = (
	callback: (messages: MessageItem[]) => void
) => {
	const index = eventHandlers.indexOf(callback);
	if (index > -1) {
		eventHandlers.splice(index, 1);
	}
};

export const clearMessages = () => {
	allChatMessages.value = [];
};

export const cancelMonitoring = () => {
	tickHandler.cancel();
};

const runWithLogging = (fn: () => void) => {
	try {
		fn();
	} catch (error) {
		console.error(error);
	}
};

setTimeout(
	() =>
		(tickHandler = executeEachTick(() => {
			const messages = tryGetChatBoxMessages();

			if (messages.length > 0) {
				eventHandlers.forEach((handler) =>
					runWithLogging(() => handler(messages))
				);
				allChatMessages.value = [...allChatMessages.value, ...messages];
			}
		})),
	1000
);
