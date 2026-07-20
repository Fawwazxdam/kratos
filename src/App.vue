<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDarkMode } from '@/utils/darkMode'

const { init } = useDarkMode()

onMounted(() => {
  init()
})
</script>

<template>
  <RouterView />
</template>
