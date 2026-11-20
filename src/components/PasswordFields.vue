<script setup>
import { Password } from "primevue"
import { computed, useId, watch } from "vue"
import passwordSchema from "@/helpers/validation-schemas/passwordSchema.js"

const props = defineProps({
  passwordLabel: {
    type: String,
    default: 'Password'
  },
  confirmationLabel: {
    type: String,
    default: 'Confirm password'
  },
  placeholderLabels: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const password = defineModel('password', { type: String })
const confirmation = defineModel('confirmation', { type: String })
const valid = defineModel('valid', { type: Boolean, default: false })

const id = useId()

const errors = computed(() => {
  if (props.error) return { password: props.error, password_confirmation: props.error }
  try {
    passwordSchema.validateSync(
      { password: password.value, password_confirmation: confirmation.value },
      { abortEarly: false }
    )
    return {}
  } catch (e) {
    return Object.fromEntries(e.inner.map(({ path, message }) => [path, message]))
  }
})

const fields = computed(() => [
  {
    key: 'password',
    model: password,
    label: props.passwordLabel,
    success: 'Password is valid',
    error: errors.value.password
  },
  {
    key: 'confirmation',
    model: confirmation,
    label: props.confirmationLabel,
    success: 'Passwords match',
    error: errors.value.password_confirmation
  }
])

watch(errors, (value) => { valid.value = Object.keys(value).length === 0 }, { immediate: true })
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="field in fields" :key="field.key" class="flex flex-col gap-1">
      <label v-if="!placeholderLabels" :for="`${id}-${field.key}`" class="font-medium">{{ field.label }}</label>
      <Password
        v-model="field.model.value"
        :input-id="`${id}-${field.key}`"
        :input-props="{ autocomplete: 'new-password', 'aria-label': field.label }"
        :placeholder="placeholderLabels ? field.label : undefined"
        :class="{ 'password-valid': field.model.value && !field.error }"
        :invalid="!!field.model.value && !!field.error"
        :feedback="false"
        :disabled="disabled"
        toggle-mask
        fluid
      />
      <template v-if="field.model.value">
        <small v-if="field.error" class="text-red-400">{{ field.error }}</small>
        <small v-else class="text-green-400"><i class="pi pi-check text-xs"></i> {{ field.success }}</small>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.password-valid :deep(.p-password-input:enabled) {
  border-color: var(--p-green-400);
}
</style>
