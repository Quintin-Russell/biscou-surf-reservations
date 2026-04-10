<script setup>
import { ProgressSpinner } from 'primevue'
import { defineProps } from 'vue'

// props
const props = defineProps({
  width: {
    type: String,
    default: '5rem'
  },
  height: {
    type: String,
    default: '5rem'
  },
  containerClass: {
    type: String,
    default: 'w-full h-full flex items-center justify-center'
  },
  className: {
    type: String,
    default: ''
  },
  wholePage: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="wholePage ? 'whole-page flex items-center' : containerClass">
    <ProgressSpinner
      :class="className + 'm-auto'"
      :style="{ 'width': `${width}`, 'height': `${height}`}"
    />
  </div>
</template>

<style scoped>

</style>