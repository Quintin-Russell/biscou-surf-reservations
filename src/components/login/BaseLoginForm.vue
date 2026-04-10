<script setup>
import { InputText, Password, Button } from "primevue"
import { Form } from '@primevue/forms'

import { ref, computed, defineProps, defineEmits, inject } from 'vue'
import { authService } from '@/services'

// props
const props = defineProps(['email', 'password'])

// emits
const emit = defineEmits(['login', 'reset', 'isNewUser', 'update:email', 'update:password'])

// inject
const { errors, submitError } = inject('formValidations')

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
const emailError = computed(() => 'email' in errors)

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

const emitReset = () => {
  emailExists.value = false
  emit('reset')
}

const onSubmit = function () {
  emit('login')
}
</script>

<template>
  <Form class="flex justify-center flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col gap-1">
      <InputText
          :model-value="email"
          email
          name="email"
          type="text"
          placeholder="Email"
          :invalid="emailError"
          @update:model-value="updateEmail"
      />
      <small v-if="emailError" class="text-red-400">{{ emailError }}</small>
      <div class="w-full">
        <div
            v-if="'secondaryText' in buttonProps"
            class="text-red-400"
        >
          Hmm, we don't recognize that email
        </div>
        <div v-if="!submitError" class="flex w-full justify-between">
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
        :severity="submitError ? 'danger' : 'secondary'"
        :variant="submitError && 'outlined'"
        label="Submit"
    />
    <div v-if="submitError" class="flex flex-col justify-center">
      <small class="m-auto text-red-400">{{ submitError }}</small>
      <br />
      <Button
        class="w-50 m-auto"
        severity="secondary"
        label="Try Again"
        @click="emitReset"
      />
    </div>
  </Form>
</template>

<style scoped>
::v-deep .p-password > input {
  width: 100%;
}
[data-p="outlined"] {
  border-color: red !important;
}
</style>
