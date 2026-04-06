<script setup>
import BaseLoginForm from "@/components/login/BaseLoginForm.vue"
import NewUserForm from "@/components/login/NewUserForm.vue"

import { ref, provide } from "vue"
import { useRouter } from "vue-router"
import { useMeStore } from "@/stores/index.js"
import { useFormValidation } from "@/compostables/useFormValidation.js"
import newUserSchema from '@/helpers/validation-schemas/newUserSchema.js'

// refs
const password = ref('')
const shouldShowNewUserForm = ref(false)

// form data and validations
const formValidations = useFormValidation(newUserSchema)
const { defineField, errors } = formValidations
const [email, emailAttrs] = defineField('email')

// provide
provide('formValidations', formValidations)

// misc
const router = useRouter()
const meStore = useMeStore()

// methods
const showNewUserForm = () => {
  shouldShowNewUserForm.value = true
}

const hideNewUserForm = () => {
  shouldShowNewUserForm.value = false
}

const handleNewUserLogin = (user) => {
  meStore.setMe(user, router)
}

const login = async () => {
  try {
    const loginParams = {email: email.value.trim(), password: password.value}
    await meStore.login(loginParams, router)
  } catch(e) {
    console.error('Error logging in: ', e)
  }
}
</script>

<template>
  <NewUserForm
      v-if="shouldShowNewUserForm"
      :email="email"
      @newUserLogin="handleNewUserLogin"
      @hide="hideNewUserForm"
  />
  <BaseLoginForm
      v-else
      v-model:email="email"
      v-model:password="password"
      :error="errors.email"
      @isNewUser="showNewUserForm"
      @login="login"
  />
</template>

<style scoped>

</style>