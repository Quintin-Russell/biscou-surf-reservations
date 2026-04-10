<script setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue'

import { useMeStore } from "@/stores/index.js"
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const meStore = useMeStore()
const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  try {
    await meStore.initialize(router)
  } catch(e) {
    console.error({e})
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <LoadingSpinner v-if="loading" width="10rem" height="10rem" />
  <router-view v-else />
</template>

<style scoped>
</style>
