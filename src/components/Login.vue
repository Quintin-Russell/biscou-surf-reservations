<script setup>
import { ref } from 'vue'
import { InputText, Button } from "primevue"
import { Form } from '@primevue/forms';
import {useMeStore} from "../stores/index.js";
import {useRouter} from "vue-router";

const email = ref('')
const password = ref('')
const router = useRouter()

const onSubmit = async function () {
  try {
    const meStore = useMeStore()
    const loginParams = {email: email.value, password: password.value}
    await meStore.login(loginParams, router)
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
