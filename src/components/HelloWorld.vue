<script setup lang="ts">
import { clearMessages, allChatMessages } from '../helpers/chatbox';
import { ref } from 'vue'
import OverloadTracker from './OverloadTracker.vue';

defineProps<{ msg: string }>()

const count = ref(0)


</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="clearMessages">Clear Messages</button>
    <p>
      Plugins:
      <br />
      <OverloadTracker />

      Messages:
      <br />
      <div style="text-align: left;" v-for="(message, index) in allChatMessages" :key="index">
        [{{message.timestamp}}] - {{message.clanTag ? `[${message.clanTag}]` : ""}} {{ message.text }}
      </div>
    </p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
