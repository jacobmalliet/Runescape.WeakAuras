<script setup lang="ts">
import * as a1lib from "@alt1/base";
import { MessageItem, onMessage, removeOnMessage } from '../helpers/chatbox'
import { onDeactivated, ref, watch } from 'vue'


const processMessages = (messages : MessageItem[]) => {
  messages.forEach(message => {
    if (message.text.includes('eating this')) {
      (window as any).white = a1lib.mixColor(255, 255, 255);
      const white = a1lib.mixColor(255, 255, 255);

      const height = alt1.rsHeight;
      const width = alt1.rsWidth;

      const x = width / 2;
      const y = height / 2;
      alt1.overLayTextEx('Run away little girl, run away', white, 36, Math.floor(x), Math.floor(y), 5000, 'sans-serif', true, false);
    }
  });
};

onMessage(processMessages);

onDeactivated(() => {
 removeOnMessage(processMessages);
});
</script>

<template>
  <div class="card">
    <span>OverLoad Needed!</span>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
