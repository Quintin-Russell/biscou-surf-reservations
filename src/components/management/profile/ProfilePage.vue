<script setup>
import { Button } from "primevue"
import { ref } from "vue"
import UserForm from "@/components/management/users/UserForm.vue"
import ChangePasswordDialog from "./ChangePasswordDialog.vue"
import { useMeStore } from "@/stores/index.js"

const meStore = useMeStore()
const showChangePassword = ref(false)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between gap-2 mb-3">
      <h1 class="text-2xl font-semibold">My Profile</h1>
      <Button label="Change Password" icon="pi pi-lock" severity="secondary" variant="outlined" @click="showChangePassword = true" />
    </div>
    <UserForm v-if="meStore.me" :user="meStore.me" profile class="flex-1 w-full" />
    <ChangePasswordDialog v-model:visible="showChangePassword" />
  </div>
</template>
