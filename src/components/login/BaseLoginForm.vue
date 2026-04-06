<script setup>
import { InputText, Password, Button } from "primevue"
import { Form } from '@primevue/forms'

import { ref, computed, defineProps, defineEmits, inject } from 'vue'
import { authService } from '@/services'

// props
const props = defineProps(['email', 'password', 'error'])

// emits
const emit = defineEmits(['login', 'isNewUser', 'update:email', 'update:password'])

// inject
inject('formValidations')

// refs
const emailExists = ref(false)
const couldBeNewUser = ref(false)

// computed
const buttonProps = computed(() => {
  const splitView = {
    primaryText: 'Try Again',
    secondaryText: 'Sign Up',
    class: 'w-45'
  }
  const onlyPrimary = {
    primaryText: 'Next',
    class: 'w-full'
  }

  return couldBeNewUser.value ? splitView : onlyPrimary
})
const primaryButtonText = computed(() => couldBeNewUser.value ? 'Try again' : 'Next')

// methods
const checkIfEmailIsUser = async function () {
  emailExists.value = await authService.emailExists(props.email.trim())
  couldBeNewUser.value = !emailExists.value
}

const resetUserValues = () => {
  couldBeNewUser.value = false
  emailExists.value = false
}

const handlePrimaryButtonClick = async () => {
  if (primaryButtonText.value === 'Next') {
    await checkIfEmailIsUser()
  } else {
    resetUserValues()
  }
}

const updateEmail = (newEmailValue) => {
  emit('update:email', newEmailValue)
}

const updatePassword = (newPasswordValue) => {
  emit('update:password', newPasswordValue)
}

const onSubmit = function () {
  emit('login')
}
</script>

<template>
  <Form class="flex justify-center flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col gap-1 px-2">
      <InputText
          :model-value="email"
          email
          name="email"
          type="text"
          placeholder="Email"
          :invalid="error"
          @update:model-value="updateEmail"
      />
      <small v-if="error" class="text-red-400">{{ error }}</small>
      <div class="w-full">
        <div
            v-if="'secondaryText' in buttonProps"
            class="text-red-400"
        >
          Hmm, we don't recognize that email
        </div>
        <div class="flex w-full justify-between">
          <Button
              v-if="!emailExists"
              :class="buttonProps.class"
              :severity="'secondaryText' in buttonProps ? 'warn' : 'secondary'"
              :label="buttonProps.primaryText"
              :disabled="!email"
              @click="handlePrimaryButtonClick"
          />
          <Button
              v-if="'secondaryText' in buttonProps"
              :class="buttonProps.class"
              severity="secondary"
              :label="buttonProps.secondaryText"
              @click="emit('isNewUser')"
          />
        </div>
      </div>
    </div>
    <div v-if="emailExists" class="flex flex-col gap-1">
      <Password
          :model-value="password"
          placeholder="Password"
          :feedback="false"
          toggle-mask
          @update:model-value="updatePassword"
      />
    </div>
    <Button
        v-if="emailExists"
        :disabled="!password.length"
        type="submit"
        severity="secondary"
        label="Submit"
    />
  </Form>
</template>

<style scoped>
::v-deep .p-password > input {
  width: 100%;
}
</style>
