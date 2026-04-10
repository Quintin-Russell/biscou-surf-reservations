<script setup>
import BaseLoginForm from "@/components/login/BaseLoginForm.vue"
import NewUserForm from "@/components/login/NewUserForm.vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import { ref, provide } from "vue"
import { useRouter } from "vue-router"
import { useMeStore } from "@/stores/index.js"
import { useFormValidation } from "@/compostables/useFormValidation.js"
import newUserSchema from '@/helpers/validation-schemas/newUserSchema.js'

// refs
const password = ref('')
const shouldShowNewUserForm = ref(false)
const loading = ref(false)

// form data and validations
const formValidations = useFormValidation(newUserSchema)
const { defineField, submitError, reset } = formValidations
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
    loading.value = true
    const loginParams = {email: email.value.trim(), password: password.value}
    await meStore.login(loginParams, router)
  } catch(e) {
    console.error('Error logging in: ', e)
    submitError.value = 'Error logging in'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  reset()
  password.value = ''
}
</script>

<template>
  <LoadingSpinner v-if="loading" wholePage />
  <div v-else class="px-2">
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
        @isNewUser="showNewUserForm"
        @login="login"
        @reset="resetForm"
    />
  </div>
</template>

<style scoped>

</style>