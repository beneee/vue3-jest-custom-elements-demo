<script setup lang="ts">
import '@vaadin/vaadin-button/vaadin-button.js'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <vaadin-button theme="primary" @click="count++">
    count is: {{ count }}
  </vaadin-button>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
