<script setup>
import { ref } from 'vue'
import { InputText, Button } from "primevue"
import { Form } from '@primevue/forms';
import { authService } from "../services/index.js"

const email = ref('')
const password = ref('')

const onSubmit = async function () {
  // import create auth here
  try {
    const loginParams = {email: email.value, password: password.value}
   await authService.login(loginParams)
  // set user here
  } catch(e) {
    console.log(e)
  }
}
</script>

<template>
  <Form class="flex justify-center flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col gap-1">
      <InputText name="email" type="text" placeholder="Email" v-model="email" />
    </div>
    <div class="flex flex-col gap-1">
      <InputText name="password" type="text" placeholder="Password" v-model="password" />
    </div>
    <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<style scoped>
</style>
