<script setup>
import { useMeStore } from "@/stores/index.js"
import { onMounted, ref } from "vue";
import {useRouter} from "vue-router";

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
  <div v-if="loading">
    Loading....
  </div>
  <router-view v-else />
</template>

<style scoped>
</style>
