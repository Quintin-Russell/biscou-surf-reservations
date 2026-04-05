<script setup>
import BaseLoginForm from "@/components/login/BaseLoginForm.vue"
import NewUserForm from "@/components/login/NewUserForm.vue"

import {ref} from "vue"
import {useRouter} from "vue-router"
import {useMeStore} from "@/stores/index.js"
import {useFormValidation} from "@/compostables/useFormValidation.js"
import newUserSchema from '@/validation-schemas/newUserSchema.js'
// refs
const password = ref('')

// form data and validations
const {
  defineField,
  errors,
} = useFormValidation(newUserSchema)

const [email, emailAttrs] = defineField('email')

const shouldShowNewUserForm = ref(false)


const router = useRouter()
const meStore = useMeStore()

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
    console.log(e)
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